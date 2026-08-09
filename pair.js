const {
    default: makeWASocket,
    DisconnectReason,
    PHONENUMBER_MCC,
    makeCacheableSignalKeyStore,
    useMultiFileAuthState,
    Browsers,
    proto,
    fetchLatestBaileysVersion,
    makeInMemoryStore,
    generateMessageTag
} = require("@whiskeysockets/baileys");
const NodeCache = require("node-cache");
const _ = require('lodash')
const {
    Boom
} = require('@hapi/boom')
const PhoneNumber = require('awesome-phonenumber')
const readline = require("readline");
const pino = require('pino')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const store = makeInMemoryStore ? makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) }) : null;
let msgRetryCounterCache;

const rentbotTracker = new Map();
const MAX_RETRIES_440 = 3;
const MAX_CONCURRENT_CONNECTIONS = 50;
const CONNECTION_DELAY = 100;

const connectionQueue = [];
let activeConnections = 0;

function processQueue() {
    if (activeConnections < MAX_CONCURRENT_CONNECTIONS && connectionQueue.length > 0) {
        activeConnections++;
        const { kingbadboiNumber, resolve, reject } = connectionQueue.shift();
        
        startpairing(kingbadboiNumber)
            .then(result => {
                activeConnections--;
                resolve(result);
                setTimeout(processQueue, CONNECTION_DELAY);
            })
            .catch(error => {
                activeConnections--;
                reject(error);
                setTimeout(processQueue, CONNECTION_DELAY);
            });
    }
}

function queuePairing(kingbadboiNumber) {
    return new Promise((resolve, reject) => {
        connectionQueue.push({ kingbadboiNumber, resolve, reject });
        processQueue();
    });
}

function deleteFolderRecursive(folderPath) {
    if (fs.existsSync(folderPath)) {
        fs.readdirSync(folderPath).forEach(file => {
            const curPath = path.join(folderPath, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(folderPath);
    }
}

async function validateSession(kingbadboiNumber) {
    const sessionPath = `./kingbadboitimewisher/pairing/${kingbadboiNumber}`;
    const credsPath = path.join(sessionPath, 'creds.json');
    
    if (!fs.existsSync(credsPath)) {
        console.log(chalk.yellow(`⚠️ No creds.json for ${kingbadboiNumber}`));
        return false;
    }
    
    try {
        const credsContent = fs.readFileSync(credsPath, 'utf8');
        JSON.parse(credsContent);
        return true;
    } catch (error) {
        console.log(chalk.red(`❌ Corrupted creds.json for ${kingbadboiNumber}`));
        return false;
    }
}

function forceCleanupSession(kingbadboiNumber) {
    const sessionPath = `./kingbadboitimewisher/pairing/${kingbadboiNumber}`;
    console.log(chalk.yellow(`🗑️ Force cleaning session: ${sessionPath}`));
    deleteFolderRecursive(sessionPath);
    rentbotTracker.delete(kingbadboiNumber);
}

function ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(chalk.blue(`📁 Created directory: ${dirPath}`));
    }
}

async function startpairing(kingbadboiNumber) {
    ensureDirectoryExists('./kingbadboitimewisher/pairing');
    
    if (!rentbotTracker.has(kingbadboiNumber)) {
        rentbotTracker.set(kingbadboiNumber, {
            connection: null,
            retryCount: 0,
            disconnected: false,
            lastActivity: Date.now()
        });
    }
    
    const tracker = rentbotTracker.get(kingbadboiNumber);
    tracker.retryCount++;
    tracker.disconnected = false;
    tracker.lastActivity = Date.now();

    const { version, isLatest } = await fetchLatestBaileysVersion();
    
    const sessionPath = `./kingbadboitimewisher/pairing/${kingbadboiNumber}`;
    ensureDirectoryExists(sessionPath);
    
    const {
        state,
        saveCreds
    } = await useMultiFileAuthState(sessionPath);

    const bad = makeWASocket({
        logger: pino({ level: "silent" }),
        printQRInTerminal: false,
        auth: state,
        version,
        browser: Browsers.ubuntu("Edge"),
        getMessage: async key => {
            if (!store) return { conversation: '' };
            const jid = key.remoteJid;
            const msg = await store.loadMessage(jid, key.id);
            return msg?.message || '';
        },
        shouldSyncHistoryMessage: msg => {
            console.log(`\x1b[32mLoading Chat [${msg.progress}%]\x1b[39m`);
            return !!msg.syncType;
        },
        connectTimeoutMs: 60000,
        defaultQueryTimeoutMs: 60000,
        keepAliveIntervalMs: 30000,
        emitOwnEvents: true,
        fireInitQueries: true,
        generateHighQualityLinkPreview: true,
        syncFullHistory: true,
        markOnlineOnConnect: true,
    })
    
    tracker.connection = bad;
    
    if (store) store.bind(bad.ev);

    if (!state.creds.registered) {
        let phoneNumber = kingbadboiNumber.replace(/[^0-9]/g, '');
        
        if (!phoneNumber) {
            throw new Error('Invalid phone number');
        }
        
        setTimeout(async () => {
            try {
                let code = await bad.requestPairingCode(phoneNumber);
                code = code?.match(/.{1,4}/g)?.join("-") || code;
                
                console.log(chalk.bgGreen.black(`📱 Pairing code for ${kingbadboiNumber}: ${chalk.white.bold(code)}`));

                ensureDirectoryExists('./kingbadboitimewisher/pairing');
                
                fs.writeFileSync(
                    './kingbadboitimewisher/pairing/pairing.json',
                    JSON.stringify({ 
                        number: kingbadboiNumber,
                        code: code,
                        timestamp: new Date().toISOString()
                    }, null, 2),
                    'utf8'
                );
                
                console.log(chalk.green(`✓ Pairing code saved to pairing.json`));
            } catch (err) {
                console.log(chalk.red(`❌ Error requesting pairing code: ${err.message}`));
            }
        }, 3000);
    }

    // 🔥 ENHANCED CONNECTION HANDLER WITH KEEP-ALIVE
    bad.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect } = update;
        const tracker = rentbotTracker.get(kingbadboiNumber);

        if (connection === "close") {
            let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
            console.log(chalk.yellow(`🔌 Connection closed for ${kingbadboiNumber}, reason: ${reason}`));

            if (reason === 405) {
                console.log(chalk.red.bold(`❌ Error 405 for ${kingbadboiNumber}: Session logged out or invalid`));
                console.log(chalk.yellow(`🗑️ Force cleaning session for ${kingbadboiNumber}...`));
                
                forceCleanupSession(kingbadboiNumber);
                
                tracker.disconnected = true;
                tracker.connection = null;
                
                console.log(chalk.red(`🚫 ${kingbadboiNumber} will NOT reconnect. User must re-pair.`));
                return;
            } else if (reason === 440) {
                if (tracker.retryCount < MAX_RETRIES_440) {
                    console.warn(chalk.yellow(`⚠️ Error 440 for ${kingbadboiNumber}. Retry ${tracker.retryCount}/${MAX_RETRIES_440}...`));
                    await sleep(3000);
                    queuePairing(kingbadboiNumber);
                } else {
                    console.error(chalk.red.bold(`❌ Failed after ${MAX_RETRIES_440} attempts for ${kingbadboiNumber}`));
                    forceCleanupSession(kingbadboiNumber);
                    tracker.disconnected = true;
                }
            } else if (reason === DisconnectReason.badSession) {
                console.log(chalk.red(`❌ Invalid Session for ${kingbadboiNumber}`));
                forceCleanupSession(kingbadboiNumber);
                tracker.disconnected = true;
            } else if (reason === DisconnectReason.loggedOut) {
                console.log(chalk.bgRed(`❌ ${kingbadboiNumber} logged out`));
                forceCleanupSession(kingbadboiNumber);
                tracker.disconnected = true;
            } else if (reason === DisconnectReason.connectionClosed || 
                       reason === DisconnectReason.connectionLost || 
                       reason === DisconnectReason.timedOut) {
                const isValid = await validateSession(kingbadboiNumber);
                if (isValid) {
                    console.log(chalk.yellow(`🔄 Reconnecting ${kingbadboiNumber}...`));
                    await sleep(3000);
                    queuePairing(kingbadboiNumber);
                } else {
                    console.log(chalk.red(`❌ Invalid session for ${kingbadboiNumber}`));
                    tracker.disconnected = true;
                }
            } else if (reason === DisconnectReason.restartRequired) {
                console.log(chalk.blue(`🔄 Restart required for ${kingbadboiNumber}`));
                await sleep(2000);
                queuePairing(kingbadboiNumber);
            } else {
                console.log(chalk.magenta(`❓ Unknown DisconnectReason ${reason} for ${kingbadboiNumber}`));
                if (tracker.retryCount < 2) {
                    await sleep(5000);
                    queuePairing(kingbadboiNumber);
                } else {
                    console.log(chalk.red(`❌ Max retries for ${kingbadboiNumber}`));
                    tracker.disconnected = true;
                }
            }
        } else if (connection === "open") {
            console.log(chalk.bgGreen.black(`✅ Connected: ${kingbadboiNumber}`));
            tracker.retryCount = 0;
            tracker.disconnected = false;
            tracker.lastActivity = Date.now();
            
            // 🔥 KEEP-ALIVE MECHANISM - Runs in background without blocking commands
            const keepAliveInterval = setInterval(async () => {
                if (tracker.disconnected) {
                    clearInterval(keepAliveInterval);
                    return;
                }
                
                try {
                    // Only send presence if connection is active
                    if (bad.ws?.readyState === 1) {
                        await bad.sendPresenceUpdate('available');
                        tracker.lastActivity = Date.now();
                    }
                } catch (err) {
                    // Silently fail - keep-alive errors are non-critical
                }
            }, 45000); // Every 45 seconds
            
            console.log(chalk.green.bold(`🎉 𓆩 ☠︎︎ 𝐗 𝐍𝐎𝐁𝐈𝐓𝐀 𝐌𝐃 ☠︎︎ online: ${kingbadboiNumber}`));
            console.log(chalk.cyan(`💓 Keep-alive running (silent mode)`));
            console.log(chalk.green(`✅ Session active!`));
        } else if (connection === "connecting") {
            console.log(chalk.blue(`🔄 Connecting ${kingbadboiNumber}...`));
        }
    });

    bad.ev.on('creds.update', saveCreds);

    // ───────── MESSAGE HANDLER (X NOBITA MD COMMANDS) ─────────
    bad.ev.on('messages.upsert', async ({ messages }) => {
        try {
            const m = messages[0]
            if (!m?.message) return
            const fromMe = m.key.fromMe
            const remoteJid = m.key.remoteJid
            const sender = m.key.participant || remoteJid

            // Ignore broadcast/status
            if (remoteJid?.endsWith('broadcast') || remoteJid === 'status@broadcast') return

            // ── Group protection hooks ──
            if (remoteJid.endsWith('@g.us')) {
                const { protectionHook } = require('./commands')
                const blocked = protectionHook(bad, { key: m.key, sender, message: m.message, text: m.message?.conversation || m.message?.extendedTextMessage?.text || '' })
                if (blocked) return
            }

            // ── Auto-read / auto-typing ──
            if (global.autoread) await bad.readMessages([m.key])
            if (remoteJid.endsWith('@s.whatsapp.net') && global.autoTyping) {
                await bad.sendPresenceUpdate('composing', remoteJid)
                await sleep(2000)
                await bad.sendPresenceUpdate('paused', remoteJid)
            }

            // Only handle text commands
            const text = m.message?.conversation || m.message?.extendedTextMessage?.text
            if (!text) return

            // Ignore own messages in private unless configured
            if (fromMe && remoteJid.endsWith('@s.whatsapp.net')) return

            const prefix = /^[#.!\/]/.test(text) ? text[0] : (global.xprefix || '.')
            if (!text.startsWith(prefix)) return

            const args = text.slice(prefix.length).trim().split(/\s+/)
            const command = args.shift().toLowerCase()

            const { commands } = require('./commands')
            const cmd = commands[command]
            if (!cmd) return

            // Owner-only check (commands that need it check inside)
            // ── SELF MODE CHECK ──
            const isOwner = sender.split('@')[0] === global.owner
            if (global.status && !isOwner) return

            // Extended message object
            const extended = {
                key: m.key,
                sender,
                text,
                quoted: m.message?.extendedTextMessage?.contextInfo?.quotedMessage
                    ? { ...m.message.extendedTextMessage.contextInfo, sender: m.message.extendedTextMessage.contextInfo.participant || remoteJid, message: m.message.extendedTextMessage.contextInfo.quotedMessage,
                        download: async () => {
                            const msg = m.message.extendedTextMessage.contextInfo.quotedMessage
                            const type = Object.keys(msg)[0]
                            return bad.downloadMediaMessage({ key: m.message.extendedTextMessage.contextInfo.stanzaId ? { remoteJid, fromMe: false, id: m.message.extendedTextMessage.contextInfo.stanzaId, participant: m.message.extendedTextMessage.contextInfo.participant } : m.key, message: msg })
                        }
                      }
                    : null,
                mentionedJid: m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [],
                reply: (t) => bad.sendMessage(remoteJid, { text: t }, { quoted: m }),
                download: async () => bad.downloadMediaMessage(m)
            }
            // Fix quoted.download binding
            if (extended.quoted) {
                const qm = { key: { remoteJid, fromMe: false, id: m.message.extendedTextMessage.contextInfo.stanzaId, participant: m.message.extendedTextMessage.contextInfo.participant }, message: m.message.extendedTextMessage.contextInfo.quotedMessage }
                extended.quoted.download = () => bad.downloadMediaMessage(qm)
            }

            console.log(chalk.cyan(`📩 CMD: .${command} from ${sender}`))
            await cmd(bad, extended, args, args.join(' '))
        } catch (err) {
            console.error(chalk.red('❌ Command handler error:', err.message))
        }
    })

    bad.downloadMediaMessage = async (msg) => {
        const type = Object.keys(msg.message || {})[0]
        const content = msg.message[type]
        const stream = await bad.downloadContentFromMessage(content, type.replace('Message', ''))
        let buffer = Buffer.from([])
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk])
        return buffer
    }

    return bad;
}

module.exports = startpairing;
