async function isGroupAdmin(sock, m) {
    const groupMetadata = await sock.groupMetadata(m.key.remoteJid)
    const admins = groupMetadata.participants.filter(p => p.admin).map(p => p.id)
    return admins.includes(m.sender)
}

async function isBotAdmin(sock, m) {
    const groupMetadata = await sock.groupMetadata(m.key.remoteJid)
    const bot = groupMetadata.participants.find(p => p.id === sock.user.id)
    return bot?.admin === 'admin' || bot?.admin === 'superadmin'
}

async function cmd_kick(sock, m) {
    const groupAdmin = await isGroupAdmin(sock, m)
    if (!groupAdmin) return m.reply('Only group admins can use this')
    const jid = m.mentionedJid?.[0] || m.quoted?.sender
    if (!jid) return m.reply('Mention or reply a user')
    await sock.groupParticipantsUpdate(m.key.remoteJid, [jid], 'remove')
    return m.reply('✅ Kicked')
}

async function cmd_add(sock, m) {
    const groupAdmin = await isGroupAdmin(sock, m)
    if (!groupAdmin) return m.reply('Only group admins can use this')
    const jid = m.mentionedJid?.[0] || m.quoted?.sender
    if (!jid) return m.reply('Mention or reply a user')
    await sock.groupParticipantsUpdate(m.key.remoteJid, [jid], 'add')
    return m.reply('✅ Added')
}

async function cmd_promote(sock, m) {
    const groupAdmin = await isGroupAdmin(sock, m)
    if (!groupAdmin) return m.reply('Only group admins can use this')
    const jid = m.mentionedJid?.[0] || m.quoted?.sender
    if (!jid) return m.reply('Mention or reply a user')
    await sock.groupParticipantsUpdate(m.key.remoteJid, [jid], 'promote')
    return m.reply('✅ Promoted to admin')
}

async function cmd_demote(sock, m) {
    const groupAdmin = await isGroupAdmin(sock, m)
    if (!groupAdmin) return m.reply('Only group admins can use this')
    const jid = m.mentionedJid?.[0] || m.quoted?.sender
    if (!jid) return m.reply('Mention or reply a user')
    await sock.groupParticipantsUpdate(m.key.remoteJid, [jid], 'demote')
    return m.reply('✅ Demoted')
}

async function cmd_warn(sock, m) {
    const groupAdmin = await isGroupAdmin(sock, m)
    if (!groupAdmin) return m.reply('Only group admins can use this')
    const jid = m.mentionedJid?.[0] || m.quoted?.sender
    if (!jid) return m.reply('Mention or reply a user')
    const fs = require('fs').promises
    const dbPath = './database/warns.json'
    let db = {}
    try { db = JSON.parse(await fs.readFile(dbPath)) } catch {}
    db[jid] = (db[jid] || 0) + 1
    await fs.writeFile(dbPath, JSON.stringify(db))
    if (db[jid] >= 3) {
        delete db[jid]
        await fs.writeFile(dbPath, JSON.stringify(db))
        await sock.groupParticipantsUpdate(m.key.remoteJid, [jid], 'remove')
        return m.reply('⚠️ Warn 3/3 — kicked!')
    }
    return m.reply(`⚠️ Warned ${db[jid]}/3`)
}

async function cmd_warncount(sock, m) {
    const jid = m.mentionedJid?.[0] || m.quoted?.sender || m.sender
    const fs = require('fs').promises
    let db = {}
    try { db = JSON.parse(await fs.readFile('./database/warns.json')) } catch {}
    return m.reply(`⚠️ Warn count: ${db[jid] || 0}/3`)
}

async function cmd_warnreset(sock, m) {
    const groupAdmin = await isGroupAdmin(sock, m)
    if (!groupAdmin) return m.reply('Only group admins can use this')
    const jid = m.mentionedJid?.[0] || m.quoted?.sender
    if (!jid) return m.reply('Mention or reply a user')
    const fs = require('fs').promises
    let db = {}
    try { db = JSON.parse(await fs.readFile('./database/warns.json')) } catch {}
    delete db[jid]
    await fs.writeFile('./database/warns.json', JSON.stringify(db))
    return m.reply('✅ Warn reset')
}

async function cmd_admins(sock, m) {
    const metadata = await sock.groupMetadata(m.key.remoteJid)
    const admins = metadata.participants.filter(p => p.admin).map(p => `• @${p.id.split('@')[0]}`).join('\n')
    return sock.sendMessage(m.key.remoteJid, { text: `*👑 Admins*\n\n${admins || 'none'}`, mentions: metadata.participants.filter(p => p.admin).map(p => p.id) }, { quoted: m })
}

async function cmd_tagadmins(sock, m) {
    const metadata = await sock.groupMetadata(m.key.remoteJid)
    const mentions = metadata.participants.filter(p => p.admin).map(p => p.id)
    return sock.sendMessage(m.key.remoteJid, { text: `*Admins:*\n${mentions.map(x => '@' + x.split('@')[0]).join(' ')}`, mentions })
}

async function cmd_admin(sock, m) {
    const metadata = await sock.groupMetadata(m.key.remoteJid)
    const admins = metadata.participants.filter(p => p.admin).map(p => p.id)
    return m.reply(`Admin count: ${admins.length}`)
}

async function cmd_requests(sock, m) {
    const groupAdmin = await isGroupAdmin(sock, m)
    if (!groupAdmin) return m.reply('Only group admins can use this')
    try {
        const req = await sock.groupRequestParticipantsList(m.key.remoteJid)
        if (!req.length) return m.reply('No pending requests')
        return sock.sendMessage(m.key.remoteJid, { text: `*📋 Requests*\n\n${req.map((r, i) => `${i+1}. @${r.jid.split('@')[0]}`).join('\n')}`, mentions: req.map(r => r.jid) }, { quoted: m })
    } catch {
        return m.reply('❌ Failed')
    }
}

async function cmd_approve(sock, m) {
    const groupAdmin = await isGroupAdmin(sock, m)
    if (!groupAdmin) return m.reply('Only group admins can use this')
    try {
        const req = await sock.groupRequestParticipantsList(m.key.remoteJid)
        for (const r of req) await sock.groupRequestParticipantsUpdate(m.key.remoteJid, [r.jid], 'approve')
        return m.reply('✅ All requests approved')
    } catch {
        return m.reply('❌ Failed')
    }
}

async function cmd_reject(sock, m) {
    const groupAdmin = await isGroupAdmin(sock, m)
    if (!groupAdmin) return m.reply('Only group admins can use this')
    try {
        const req = await sock.groupRequestParticipantsList(m.key.remoteJid)
        for (const r of req) await sock.groupRequestParticipantsUpdate(m.key.remoteJid, [r.jid], 'reject')
        return m.reply('✅ All requests rejected')
    } catch {
        return m.reply('❌ Failed')
    }
}

async function cmd_tagall(sock, m) {
    const metadata = await sock.groupMetadata(m.key.remoteJid)
    const mentions = metadata.participants.map(p => p.id)
    return sock.sendMessage(m.key.remoteJid, { text: `*TAG ALL*\n\n${mentions.map(x => '@' + x.split('@')[0]).join(' ')}`, mentions }, { quoted: m })
}

async function cmd_rtag(sock, m) {
    const metadata = await sock.groupMetadata(m.key.remoteJid)
    const mentions = metadata.participants.map(p => p.id)
    return sock.sendMessage(m.key.remoteJid, { text: `${m.text.split(' ').slice(1).join(' ') || 'Notice'}`, mentions }, { quoted: m })
}

async function cmd_totag(sock, m) {
    const metadata = await sock.groupMetadata(m.key.remoteJid)
    const mentions = metadata.participants.map(p => p.id)
    return sock.sendMessage(m.key.remoteJid, { text: `*📢 ${m.text.split(' ').slice(1).join(' ') || 'Announcement'}*\n\n${mentions.map(x => '@' + x.split('@')[0]).join(' ')}`, mentions }, { quoted: m })
}

async function cmd_everyone(sock, m) { return cmd_tagall(sock, m) }

async function cmd_announce(sock, m) { return cmd_totag(sock, m) }

async function cmd_hidetag(sock, m) {
    const metadata = await sock.groupMetadata(m.key.remoteJid)
    const mentions = metadata.participants.map(p => p.id)
    return sock.sendMessage(m.key.remoteJid, { text: m.text.split(' ').slice(1).join(' ') || 'Hi', mentions })
}

async function cmd_invite(sock, m) {
    const groupAdmin = await isGroupAdmin(sock, m)
    if (!groupAdmin) return m.reply('Only group admins can use this')
    const code = await sock.groupInviteCode(m.key.remoteJid)
    return m.reply(`*Invite Link*\n\nhttps://chat.whatsapp.com/${code}`)
}

async function cmd_inviteuser(sock, m) {
    const groupAdmin = await isGroupAdmin(sock, m)
    if (!groupAdmin) return m.reply('Only group admins can use this')
    const jid = m.mentionedJid?.[0] || m.quoted?.sender
    if (!jid) return m.reply('Mention or reply a user')
    try {
        const code = await sock.groupInviteCode(m.key.remoteJid)
        await sock.sendMessage(jid, { text: `Join: https://chat.whatsapp.com/${code}` })
        return m.reply('✅ Invite sent')
    } catch {
        return m.reply('❌ Failed')
    }
}

async function cmd_revoke(sock, m) {
    const groupAdmin = await isGroupAdmin(sock, m)
    if (!groupAdmin) return m.reply('Only group admins can use this')
    await sock.groupRevokeInvite(m.key.remoteJid)
    return m.reply('✅ Link revoked')
}

async function cmd_close(sock, m) {
    const groupAdmin = await isGroupAdmin(sock, m)
    if (!groupAdmin) return m.reply('Only group admins can use this')
    await sock.groupSettingUpdate(m.key.remoteJid, 'announcement')
    return m.reply('🔒 Group closed — only admins can send')
}

async function cmd_open(sock, m) {
    const groupAdmin = await isGroupAdmin(sock, m)
    if (!groupAdmin) return m.reply('Only group admins can use this')
    await sock.groupSettingUpdate(m.key.remoteJid, 'not_announcement')
    return m.reply('🔓 Group opened — everyone can send')
}

async function cmd_lock(sock, m) {
    const groupAdmin = await isGroupAdmin(sock, m)
    if (!groupAdmin) return m.reply('Only group admins can use this')
    await sock.groupSettingUpdate(m.key.remoteJid, 'locked')
    return m.reply('🔒 Group info locked')
}

async function cmd_unlock(sock, m) {
    const groupAdmin = await isGroupAdmin(sock, m)
    if (!groupAdmin) return m.reply('Only group admins can use this')
    await sock.groupSettingUpdate(m.key.remoteJid, 'unlocked')
    return m.reply('🔓 Group info unlocked')
}

async function cmd_subject(sock, m) {
    const groupAdmin = await isGroupAdmin(sock, m)
    if (!groupAdmin) return m.reply('Only group admins can use this')
    const name = m.text.split(' ').slice(1).join(' ')
    if (!name) return m.reply('Use: .subject new name')
    await sock.groupUpdateSubject(m.key.remoteJid, name)
    return m.reply('✅ Subject updated')
}

async function cmd_desc(sock, m) {
    const groupAdmin = await isGroupAdmin(sock, m)
    if (!groupAdmin) return m.reply('Only group admins can use this')
    const desc = m.text.split(' ').slice(1).join(' ')
    if (!desc) return m.reply('Use: .desc new description')
    await sock.groupUpdateDescription(m.key.remoteJid, desc)
    return m.reply('✅ Description updated')
}

async function cmd_setgpp(sock, m) {
    const groupAdmin = await isGroupAdmin(sock, m)
    if (!groupAdmin) return m.reply('Only group admins can use this')
    try {
        const img = await m.quoted.download()
        await sock.updateProfilePicture(m.key.remoteJid, img)
        return m.reply('✅ Group picture updated')
    } catch {
        return m.reply('❌ Reply an image with .setgpp')
    }
}

async function cmd_groupinfo(sock, m) {
    const metadata = await sock.groupMetadata(m.key.remoteJid)
    return m.reply(`*Group Info*\n\n📛 ${metadata.subject}\n👥 ${metadata.participants.length} members\n🔑 Admins: ${metadata.participants.filter(p => p.admin).length}\n📝 ${metadata.desc?.slice(0, 100) || 'none'}`)
}

async function cmd_groupstats(sock, m) { return cmd_groupinfo(sock, m) }
async function cmd_gstatus(sock, m) { return cmd_groupinfo(sock, m) }

async function cmd_poll(sock, m) {
    const text = m.text.split(' ').slice(1).join(' ')
    const parts = text.split('|').map(x => x.trim())
    if (parts.length < 3) return m.reply('Use: .poll Question | Option 1 | Option 2')
    const [question, ...options] = parts
    return sock.sendMessage(m.key.remoteJid, { poll: { name: question, values: options, selectableCount: 1 } }, { quoted: m })
}

async function cmd_disappear(sock, m) {
    const groupAdmin = await isGroupAdmin(sock, m)
    if (!groupAdmin) return m.reply('Only group admins can use this')
    const days = parseInt(m.text.split(' ')[1]) || 7
    await sock.sendMessage(m.key.remoteJid, { disappearingMessagesInChat: days * 86400 })
    return m.reply(`✅ Disappearing messages: ${days} days`)
}

// ───────── PROTECTION (in-memory state) ─────────
const protection = {}

async function cmd_antilink(sock, m) {
    const groupAdmin = await isGroupAdmin(sock, m)
    if (!groupAdmin) return m.reply('Only group admins can use this')
    protection[m.key.remoteJid] = protection[m.key.remoteJid] || {}
    protection[m.key.remoteJid].antilink = !protection[m.key.remoteJid].antilink
    return m.reply(`✅ Antilink: ${protection[m.key.remoteJid].antilink ? 'ON' : 'OFF'}`)
}
async function cmd_antibot(sock, m) {
    const groupAdmin = await isGroupAdmin(sock, m)
    if (!groupAdmin) return m.reply('Only group admins can use this')
    protection[m.key.remoteJid] = protection[m.key.remoteJid] || {}
    protection[m.key.remoteJid].antibot = !protection[m.key.remoteJid].antibot
    return m.reply(`✅ Antibot: ${protection[m.key.remoteJid].antibot ? 'ON' : 'OFF'}`)
}
async function cmd_antighost(sock, m) {
    const groupAdmin = await isGroupAdmin(sock, m)
    if (!groupAdmin) return m.reply('Only group admins can use this')
    protection[m.key.remoteJid] = protection[m.key.remoteJid] || {}
    protection[m.key.remoteJid].antighost = !protection[m.key.remoteJid].antighost
    return m.reply(`✅ Antighost: ${protection[m.key.remoteJid].antighost ? 'ON' : 'OFF'}`)
}
async function cmd_antisticker(sock, m) {
    const groupAdmin = await isGroupAdmin(sock, m)
    if (!groupAdmin) return m.reply('Only group admins can use this')
    protection[m.key.remoteJid] = protection[m.key.remoteJid] || {}
    protection[m.key.remoteJid].antisticker = !protection[m.key.remoteJid].antisticker
    return m.reply(`✅ Antisticker: ${protection[m.key.remoteJid].antisticker ? 'ON' : 'OFF'}`)
}
async function cmd_antiword(sock, m) {
    const groupAdmin = await isGroupAdmin(sock, m)
    if (!groupAdmin) return m.reply('Only group admins can use this')
    protection[m.key.remoteJid] = protection[m.key.remoteJid] || {}
    protection[m.key.remoteJid].antiword = !protection[m.key.remoteJid].antiword
    return m.reply(`✅ Antiword: ${protection[m.key.remoteJid].antiword ? 'ON' : 'OFF'}`)
}
async function cmd_protection(sock, m) {
    const groupAdmin = await isGroupAdmin(sock, m)
    if (!groupAdmin) return m.reply('Only group admins can use this')
    const p = protection[m.key.remoteJid] || {}
    return m.reply(`*🛡️ Protection Status*\n\nAntilink: ${p.antilink ? 'ON' : 'OFF'}\nAntibot: ${p.antibot ? 'ON' : 'OFF'}\nAntighost: ${p.antighost ? 'ON' : 'OFF'}\nAntisticker: ${p.antisticker ? 'ON' : 'OFF'}\nAntiword: ${p.antiword ? 'ON' : 'OFF'}`)
}

async function cmd_welcome(sock, m) {
    const groupAdmin = await isGroupAdmin(sock, m)
    if (!groupAdmin) return m.reply('Only group admins can use this')
    protection[m.key.remoteJid] = protection[m.key.remoteJid] || {}
    protection[m.key.remoteJid].welcome = !protection[m.key.remoteJid].welcome
    return m.reply(`✅ Welcome: ${protection[m.key.remoteJid].welcome ? 'ON' : 'OFF'}`)
}
async function cmd_goodbye(sock, m) {
    const groupAdmin = await isGroupAdmin(sock, m)
    if (!groupAdmin) return m.reply('Only group admins can use this')
    protection[m.key.remoteJid] = protection[m.key.remoteJid] || {}
    protection[m.key.remoteJid].goodbye = !protection[m.key.remoteJid].goodbye
    return m.reply(`✅ Goodbye: ${protection[m.key.remoteJid].goodbye ? 'ON' : 'OFF'}`)
}
async function cmd_leave(sock, m) {
    const groupAdmin = await isGroupAdmin(sock, m)
    if (!groupAdmin) return m.reply('Only group admins can use this')
    await sock.groupLeave(m.key.remoteJid)
}

// Protection hook for messages.upsert
function protectionHook(sock, m) {
    const jid = m.key.remoteJid
    const p = protection[jid] || {}
    if (!p.antilink && !p.antibot && !p.antisticker) return false
    const text = m.text || ''
    if (p.antilink && /https?:\/\//.test(text) && !m.key.fromMe) {
        sock.groupParticipantsUpdate(jid, [m.sender], 'remove')
        return true
    }
    if (p.antisticker && m.message?.stickerMessage && !m.key.fromMe) {
        sock.sendMessage(jid, { delete: m.key })
        return true
    }
    return false
}

// Join/leave welcome hook
function welcomeHook(sock, participants, jid, action) {
    const p = protection[jid] || {}
    if (action === 'add' && p.welcome) {
        sock.sendMessage(jid, { text: `*👋 Welcome* @${participants[0].split('@')[0]}!`, mentions: participants })
    }
    if (action === 'remove' && p.goodbye) {
        sock.sendMessage(jid, { text: `*👋 Goodbye* @${participants[0].split('@')[0]}!`, mentions: participants })
    }
}

module.exports = {
    kick: cmd_kick, add: cmd_add, promote: cmd_promote, demote: cmd_demote,
    warn: cmd_warn, warncount: cmd_warncount, warnreset: cmd_warnreset,
    admins: cmd_admins, tagadmins: cmd_tagadmins, admin: cmd_admin,
    requests: cmd_requests, approve: cmd_approve, reject: cmd_reject,
    antilink: cmd_antilink, antibot: cmd_antibot, antighost: cmd_antighost,
    antisticker: cmd_antisticker, antiword: cmd_antiword, protection: cmd_protection,
    tagall: cmd_tagall, rtag: cmd_rtag, totag: cmd_totag, everyone: cmd_everyone, announce: cmd_announce, hidetag: cmd_hidetag,
    invite: cmd_invite, inviteuser: cmd_inviteuser, revoke: cmd_revoke,
    close: cmd_close, open: cmd_open, lock: cmd_lock, unlock: cmd_unlock,
    subject: cmd_subject, desc: cmd_desc, setgpp: cmd_setgpp,
    groupinfo: cmd_groupinfo, groupstats: cmd_groupstats, gstatus: cmd_gstatus,
    poll: cmd_poll, disappear: cmd_disappear,
    welcome: cmd_welcome, goodbye: cmd_goodbye, leave: cmd_leave,
    protectionHook, welcomeHook
}
