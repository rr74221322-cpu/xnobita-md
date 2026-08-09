async function cmd_join(sock, m) {
    const isOwner = m.sender.split('@')[0] === global.owner
    if (!isOwner) return m.reply('Owner only!')
    const text = m.text.split(' ').slice(1).join(' ')
    if (!text) return m.reply('Use: .join https://chat.whatsapp.com/xxxx')
    try {
        const code = text.split('/').pop()
        await sock.groupAcceptInvite(code)
        return m.reply('✅ Joined')
    } catch {
        return m.reply('❌ Invalid link')
    }
}

async function cmd_leaveall(sock, m) {
    const isOwner = m.sender.split('@')[0] === global.owner
    if (!isOwner) return m.reply('Owner only!')
    const groups = await sock.groupFetchAllParticipating()
    const keys = Object.keys(groups)
    for (const jid of keys) await sock.groupLeave(jid)
    return m.reply(`✅ Left all ${keys.length} groups`)
}

async function cmd_listgc(sock, m) {
    const isOwner = m.sender.split('@')[0] === global.owner
    if (!isOwner) return m.reply('Owner only!')
    const groups = await sock.groupFetchAllParticipating()
    const keys = Object.keys(groups)
    return m.reply(`*📋 Groups (${keys.length})*\n\n${keys.map((k, i) => `${i+1}. ${groups[k].subject}`).join('\n')}`)
}

async function cmd_forward(sock, m) {
    const isOwner = m.sender.split('@')[0] === global.owner
    if (!isOwner) return m.reply('Owner only!')
    if (!m.quoted) return m.reply('Reply a message')
    const jid = m.mentionedJid?.[0] || m.quoted?.sender
    if (!jid) return m.reply('Mention a user or reply')
    try {
        await sock.forwardMessage(jid, m.quoted, { quoted: m })
        return m.reply('✅ Forwarded')
    } catch {
        return m.reply('❌ Failed')
    }
}

async function cmd_fwd(sock, m) { return cmd_forward(sock, m) }

async function cmd_quoted(sock, m) {
    if (!m.quoted) return m.reply('This message is not a quoted reply')
    try {
        const buffer = await m.quoted.download()
        const type = Object.keys(m.quoted.message || {})[0]
        if (type.includes('image')) return sock.sendMessage(m.key.remoteJid, { image: buffer }, { quoted: m })
        if (type.includes('video')) return sock.sendMessage(m.key.remoteJid, { video: buffer }, { quoted: m })
        if (type.includes('audio')) return sock.sendMessage(m.key.remoteJid, { audio: buffer, mimetype: 'audio/mpeg' }, { quoted: m })
        return sock.sendMessage(m.key.remoteJid, { text: m.quoted.text }, { quoted: m })
    } catch {
        return m.reply('❌ Failed')
    }
}

async function cmd_broadcast(sock, m) {
    const isOwner = m.sender.split('@')[0] === global.owner
    if (!isOwner) return m.reply('Owner only!')
    const text = m.text.split(' ').slice(1).join(' ')
    if (!text) return m.reply('Use: .broadcast message')
    const groups = await sock.groupFetchAllParticipating()
    const keys = Object.keys(groups)
    for (const jid of keys) {
        await sock.sendMessage(jid, { text }).catch(() => {})
    }
    return m.reply(`✅ Broadcast sent to ${keys.length} groups`)
}

async function cmd_myname(sock, m) {
    try {
        const { data } = await axios.get(`https://api.davidcyriltech.my.id/whois?jid=${m.sender}`)
        return m.reply(`*Name:* ${data?.name || sock.user?.name || 'Unknown'}`)
    } catch {
        return m.reply(`*Name:* ${sock.user?.name || 'Unknown'}`)
    }
}

module.exports = { join: cmd_join, leaveall: cmd_leaveall, listgc: cmd_listgc, forward: cmd_forward, fwd: cmd_fwd, quoted: cmd_quoted, broadcast: cmd_broadcast, myname: cmd_myname }
