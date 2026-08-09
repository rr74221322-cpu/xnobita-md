const { sleep } = require('../utils')

// ───────── CORE COMMANDS ─────────

async function cmd_menu(sock, m, args, text) {
    const me = sock.user
    const menu = `
╔══════════════════╗
🖤  𝗫 𝗡𝗢𝗕𝗜𝗧𝗔 𝗠𝗗
╚══════════════════╝
┌── 𝗢𝗪𝗡𝗘𝗥 ──
| ☝️ ${me?.id?.split(':')[0] || 'Unknown'}
| 📍 ${global.location || 'World'}
| 📦 Version: ${global.version}
└─────────────

📥 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥
  ▸ .play  .song  .yta  .ytmp3
  ▸ .fb  .ig  .tiktok  .pint  .mega
  ▸ .apk  .git  .gitclone  .url

🎭 𝗦𝗧𝗜𝗖𝗞𝗘𝗥 & 𝗠𝗘𝗗𝗜𝗔
  ▸ .sticker  .s  .take  .toimage
  ▸ .sticker2img  .video2img  .vs
  ▸ .remini  .imagehelp  .imageinfo

🤖 𝗔𝗜 & 𝗖𝗛𝗔𝗧
  ▸ .copilot  .gpt  .achar
  ▸ .aquote  .arecommend  .asearch

👑 𝗢𝗪𝗡𝗘𝗥 𝗧𝗢𝗢𝗟𝗦
  ▸ .ping  .alive  .uptime  .btpn
  ▸ .trt  .calc  .qr  .shorturl  .ssweb
  ▸ .mode  .public  .private
  ▸ .setbio  .setname  .setpp  .removepp
  ▸ .block  .unblock  .unblockall  .blocklist
  ▸ .broadcast  .del  .delete  .delme
  ▸ .forward  .fwd  .save  .saved  .quoted
  ▸ .jid  .getbio  .getname  .getpp  .whois
  ▸ .myname  .mystatus  .myprivacy
  ▸ .join  .leaveall  .listgc

⚙️ 𝗔𝗨𝗧𝗢 𝗦𝗬𝗦𝗧𝗘𝗠
  ▸ .autoread  .autotyping  .autorecord
  ▸ .autostatus  .autoreact  .anticall

🎴 𝗦𝗘𝗔𝗥𝗖𝗛 & 𝗙𝗨𝗡
  ▸ .anime  .manga  .character
  ▸ .lyrics  .weather  .wiki  .yts
  ▸ .neko  .waifu  .megumin  .shinobu
  ▸ .loli  .maid

╔══════════════════╗
🖤 𝗠𝗔𝗗𝗘 𝗕𝗬 𝗫 𝗡𝗢𝗕𝗜𝗧𝗔 𝗠𝗗 🖤
╚══════════════════╝`
    return sock.sendMessage(m.key.remoteJid, { text: menu.trim(), contextInfo: { forwardingScore: 999, isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: '120363160000000000@newsletter', newsletterName: 'X NOBITA MD' } } }, { quoted: m })
}

async function cmd_gmenu(sock, m, args, text) {
    const me = sock.user
    const menu = `
╔══════════════════╗
🖤 𝗚𝗥𝗢𝗨𝗣 𝗠𝗘𝗡𝗨 🖤
╚══════════════════╝

⚖️ 𝗠𝗢𝗗𝗘𝗥𝗔𝗧𝗜𝗢𝗡
  ▸ .kick  .add  .promote  .demote
  ▸ .warn  .warncount  .warnreset
  ▸ .admins  .tagadmins  .admin
  ▸ .requests  .approve  .reject

🔒 𝗣𝗥𝗢𝗧𝗘𝗖𝗧𝗜𝗢𝗡
  ▸ .antilink  .antibot  .antighost
  ▸ .antisticker  .antiword
  ▸ .protection  .lock  .unlock

📢 𝗚𝗥𝗢𝗨𝗣 𝗦𝗘𝗧𝗧𝗜𝗡𝗚𝗦
  ▸ .welcome  .goodbye  .leave
  ▸ .close  .open  .hidetag  .tagall
  ▸ .rtag  .totag  .everyone  .announce
  ▸ .invite  .inviteuser  .revoke
  ▸ .subject  .desc  .setgpp
  ▸ .groupinfo  .groupstats  .gstatus
  ▸ .poll  .disappear`
    return sock.sendMessage(m.key.remoteJid, { text: menu.trim() }, { quoted: m })
}

async function cmd_list(sock, m, args, text) {
    const cmds = Object.keys(global.ALL_COMMANDS || {}).sort().join('\n  ▸ .')
    return sock.sendMessage(m.key.remoteJid, { text: `*📜 X NOBITA MD — ALL COMMANDS*\n\n  ▸ .${cmds}` }, { quoted: m })
}

async function cmd_alive(sock, m, args, text) {
    return sock.sendMessage(m.key.remoteJid, { text: `*☑️ X NOBITA MD is alive!*\n\n🕐 Time: ${new Date().toLocaleTimeString()}\n📦 Version: ${global.version}` }, { quoted: m })
}

async function cmd_ping(sock, m, args, text) {
    const start = Date.now()
    await sleep(100)
    const speed = Date.now() - start
    return sock.sendMessage(m.key.remoteJid, { text: `*⚡ Pong!* \n\nLatency: ${speed}ms` }, { quoted: m })
}

async function cmd_uptime(sock, m, args, text) {
    const up = process.uptime()
    const h = Math.floor(up / 3600)
    const mn = Math.floor(up % 3600 / 60)
    const s = Math.floor(up % 60)
    return sock.sendMessage(m.key.remoteJid, { text: `*⏱️ Uptime:* ${h}h ${mn}m ${s}s` }, { quoted: m })
}

async function cmd_btpn(sock, m, args, text) {
    return sock.sendMessage(m.key.remoteJid, { text: `*🔔 BTPN* \n\nX NOBITA MD — always online.` }, { quoted: m })
}

async function cmd_owner(sock, m, args, text) {
    return sock.sendMessage(m.key.remoteJid, {
        text: `*👑 Owner X NOBITA MD*`,
        contextInfo: {
            mentionedJid: [`${global.owner}s.whatsapp.net`],
            forwardingScore: 999, isForwarded: true
        }
    }, { quoted: m })
}

async function cmd_mode(sock, m, args, text) {
    const isOwner = m.sender.split('@')[0] === global.owner
    if (!isOwner) return m.reply('Owner only!')
    if (text === 'public') { global.status = false; return m.reply('✅ Mode: PUBLIC') }
    if (text === 'self') { global.status = true; return m.reply('✅ Mode: SELF') }
    return m.reply(`Current mode: ${global.status ? 'SELF' : 'PUBLIC'}\n\nUse: .mode public | .mode self`)
}

async function cmd_public(sock, m) {
    const isOwner = m.sender.split('@')[0] === global.owner
    if (!isOwner) return m.reply('Owner only!')
    global.status = false
    return m.reply('✅ Bot mode: PUBLIC')
}

async function cmd_private(sock, m) {
    const isOwner = m.sender.split('@')[0] === global.owner
    if (!isOwner) return m.reply('Owner only!')
    global.status = true
    return m.reply('✅ Bot mode: SELF (private)')
}

async function cmd_del(sock, m) {
    const isOwner = m.sender.split('@')[0] === global.owner
    if (!isOwner) return m.reply('Owner only!')
    const target = m.quoted ? { remoteJid: m.key.remoteJid, fromMe: true, id: m.quoted.id, participant: m.quoted.sender } : m.key
    try {
        await sock.sendMessage(m.key.remoteJid, { delete: target })
        return m.reply('✅ Deleted')
    } catch {
        return m.reply('❌ Could not delete')
    }
}

async function cmd_jid(sock, m) {
    return m.reply(m.key.remoteJid)
}

async function cmd_whois(sock, m) {
    try {
        const jid = m.mentionedJid?.[0] || m.quoted?.sender || m.key.remoteJid
        const info = await sock.fetchImageUrl(jid).catch(() => null)
        return m.reply(`*Whois*\nJID: ${jid}\nPP: ${info || 'none'}`)
    } catch {
        return m.reply('❌ Error')
    }
}

async function cmd_getpp(sock, m) {
    try {
        const jid = m.mentionedJid?.[0] || m.quoted?.sender || m.key.remoteJid
        const url = await sock.profilePictureUrl(jid, 'image')
        return sock.sendMessage(m.key.remoteJid, { image: { url }, caption: `*Profile Picture*` }, { quoted: m })
    } catch {
        return m.reply('❌ No profile picture')
    }
}

async function cmd_setbio(sock, m, args) {
    const isOwner = m.sender.split('@')[0] === global.owner
    if (!isOwner) return m.reply('Owner only!')
    try {
        await sock.updateProfileStatus(args.join(' '))
        return m.reply('✅ Bio updated')
    } catch {
        return m.reply('❌ Failed')
    }
}

async function cmd_setname(sock, m, args) {
    const isOwner = m.sender.split('@')[0] === global.owner
    if (!isOwner) return m.reply('Owner only!')
    try {
        await sock.updateProfileName(args.join(' '))
        return m.reply('✅ Name updated')
    } catch {
        return m.reply('❌ Failed')
    }
}

async function cmd_setpp(sock, m) {
    const isOwner = m.sender.split('@')[0] === global.owner
    if (!isOwner) return m.reply('Owner only!')
    try {
        const img = await m.quoted.download()
        await sock.updateProfilePicture(sock.user.id, img)
        return m.reply('✅ Profile picture updated')
    } catch {
        return m.reply('❌ Failed — reply an image with .setpp')
    }
}

async function cmd_removepp(sock, m) {
    const isOwner = m.sender.split('@')[0] === global.owner
    if (!isOwner) return m.reply('Owner only!')
    try {
        await sock.removeProfilePicture(sock.user.id)
        return m.reply('✅ Profile picture removed')
    } catch {
        return m.reply('❌ Failed')
    }
}

async function cmd_block(sock, m) {
    const isOwner = m.sender.split('@')[0] === global.owner
    if (!isOwner) return m.reply('Owner only!')
    const jid = m.mentionedJid?.[0] || m.quoted?.sender
    if (!jid) return m.reply('Mention or reply a user')
    await sock.updateBlockStatus(jid, 'block')
    return m.reply('✅ Blocked')
}

async function cmd_unblock(sock, m) {
    const isOwner = m.sender.split('@')[0] === global.owner
    if (!isOwner) return m.reply('Owner only!')
    const jid = m.mentionedJid?.[0] || m.quoted?.sender
    if (!jid) return m.reply('Mention or reply a user')
    await sock.updateBlockStatus(jid, 'unblock')
    return m.reply('✅ Unblocked')
}

async function cmd_unblockall(sock, m) {
    const isOwner = m.sender.split('@')[0] === global.owner
    if (!isOwner) return m.reply('Owner only!')
    const bl = await sock.fetchBlocklist()
    if (!bl.length) return m.reply('No blocked users')
    for (const jid of bl) await sock.updateBlockStatus(jid, 'unblock')
    return m.reply(`✅ Unblocked ${bl.length} users`)
}

async function cmd_blocklist(sock, m) {
    const isOwner = m.sender.split('@')[0] === global.owner
    if (!isOwner) return m.reply('Owner only!')
    const bl = await sock.fetchBlocklist()
    if (!bl.length) return m.reply('No blocked users')
    return m.reply('*Blocklist*\n\n' + bl.map((j, i) => `${i+1}. ${j}`).join('\n'))
}

async function cmd_autoread(sock, m) {
    const isOwner = m.sender.split('@')[0] === global.owner
    if (!isOwner) return m.reply('Owner only!')
    global.autoread = !global.autoread
    return m.reply(`✅ Autoread: ${global.autoread ? 'ON' : 'OFF'}`)
}

async function cmd_autotyping(sock, m) {
    const isOwner = m.sender.split('@')[0] === global.owner
    if (!isOwner) return m.reply('Owner only!')
    global.autoTyping = !global.autoTyping
    return m.reply(`✅ Autotyping: ${global.autoTyping ? 'ON' : 'OFF'}`)
}

async function cmd_autorecord(sock, m) {
    const isOwner = m.sender.split('@')[0] === global.owner
    if (!isOwner) return m.reply('Owner only!')
    global.autoRecording = !global.autoRecording
    return m.reply(`✅ Autorecording: ${global.autoRecording ? 'ON' : 'OFF'}`)
}

async function cmd_autostatus(sock, m) {
    const isOwner = m.sender.split('@')[0] === global.owner
    if (!isOwner) return m.reply('Owner only!')
    global.autoswview = !global.autoswview
    return m.reply(`✅ Autostatus view: ${global.autoswview ? 'ON' : 'OFF'}`)
}

async function cmd_autoreact(sock, m) {
    const isOwner = m.sender.split('@')[0] === global.owner
    if (!isOwner) return m.reply('Owner only!')
    global.autoreact = !global.autoreact
    return m.reply(`✅ Autoreact: ${global.autoreact ? 'ON' : 'OFF'}`)
}

async function cmd_anticall(sock, m) {
    const isOwner = m.sender.split('@')[0] === global.owner
    if (!isOwner) return m.reply('Owner only!')
    global.anticall = !global.anticall
    return m.reply(`✅ Anticall: ${global.anticall ? 'ON' : 'OFF'}`)
}

async function cmd_trt(sock, m, args) {
    const axios = require('axios')
    if (!m.quoted && args.length < 2) return m.reply('Reply a text or: .trt bn hello')
    const lang = args[0] || 'bn'
    const query = m.quoted ? m.quoted.text : args.slice(1).join(' ')
    if (!query) return m.reply('No text')
    try {
        const { data } = await axios.get(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(query)}&langpair=en|${lang}`)
        return m.reply(`*🌐 Translate (${lang})*\n\n${data?.responseData?.translatedText}`)
    } catch {
        return m.reply('❌ Translation failed')
    }
}

async function cmd_calc(sock, m, args) {
    try {
        const expr = args.join(' ')
        if (!expr) return m.reply('Use: .calc 2+2')
        const result = Function('"use strict";return (' + expr + ')')()
        return m.reply(`*🧮 =* ${result}`)
    } catch {
        return m.reply('❌ Invalid expression')
    }
}

async function cmd_qr(sock, m, args) {
    const axios = require('axios')
    const text = args.join(' ')
    if (!text) return m.reply('Use: .qr some text')
    try {
        const url = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(text)}`
        return sock.sendMessage(m.key.remoteJid, { image: { url }, caption: '*QR Code*' }, { quoted: m })
    } catch {
        return m.reply('❌ Failed')
    }
}

async function cmd_shorturl(sock, m, args) {
    const axios = require('axios')
    const text = args.join(' ')
    if (!text) return m.reply('Use: .shorturl https://...')
    try {
        const { data } = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(text)}`)
        return m.reply(`*🔗 Shortened*\n\n${data}`)
    } catch {
        return m.reply('❌ Failed')
    }
}

async function cmd_ssweb(sock, m, args) {
    const axios = require('axios')
    const text = args.join(' ')
    if (!text) return m.reply('Use: .ssweb https://google.com')
    try {
        const url = `https://image.thum.io/get/fullpage/${text}`
        return sock.sendMessage(m.key.remoteJid, { image: { url }, caption: `*Screenshot:* ${text}` }, { quoted: m })
    } catch {
        return m.reply('❌ Failed')
    }
}

async function cmd_save(sock, m) {
    const isOwner = m.sender.split('@')[0] === global.owner
    if (!isOwner) return m.reply('Owner only!')
    if (!m.quoted) return m.reply('Reply a media')
    try {
        const type = Object.keys(m.quoted.message || {})[0]
        const buffer = await m.quoted.download()
        const ext = type.includes('video') ? 'mp4' : type.includes('audio') ? 'mp3' : 'jpg'
        await require('fs').promises.writeFile(`./saved_${Date.now()}.${ext}`, buffer)
        return m.reply('✅ Saved')
    } catch {
        return m.reply('❌ Failed')
    }
}

async function cmd_getbio(sock, m) {
    try {
        const jid = m.mentionedJid?.[0] || m.quoted?.sender || m.key.remoteJid
        const bio = await sock.fetchStatus(jid)
        return m.reply(`*Bio*\n\n${bio?.status || 'none'}`)
    } catch {
        return m.reply('❌ Failed')
    }
}

module.exports = {
    menu: cmd_menu, gmenu: cmd_gmenu, list: cmd_list, alive: cmd_alive,
    ping: cmd_ping, uptime: cmd_uptime, btpn: cmd_btpn, owner: cmd_owner,
    mode: cmd_mode, public: cmd_public, private: cmd_private,
    del: cmd_del, delete: cmd_del, delme: cmd_del,
    jid: cmd_jid, whois: cmd_whois, getpp: cmd_getpp,
    setbio: cmd_setbio, setname: cmd_setname, setpp: cmd_setpp, removepp: cmd_removepp,
    block: cmd_block, unblock: cmd_unblock, unblockall: cmd_unblockall, blocklist: cmd_blocklist,
    autoread: cmd_autoread, autotyping: cmd_autotyping, autorecord: cmd_autorecord,
    autostatus: cmd_autostatus, autoreact: cmd_autoreact, anticall: cmd_anticall,
    trt: cmd_trt, calc: cmd_calc, qr: cmd_qr, shorturl: cmd_shorturl, ssweb: cmd_ssweb,
    save: cmd_save, getbio: cmd_getbio, getname: cmd_getbio, mystatus: cmd_getbio, myprivacy: cmd_getbio
}
