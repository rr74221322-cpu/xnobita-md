const axios = require('axios')

// Shared downloader helper — uses public API endpoints
async function dlFromApi(sock, m, query, apiUrl) {
    try {
        const { data } = await axios.get(apiUrl + encodeURIComponent(query))
        const res = data?.result || data?.data || data
        if (res?.url || res?.link) {
            return sock.sendMessage(m.key.remoteJid, { video: { url: res.url || res.link }, caption: '*⬇️ Downloaded*' }, { quoted: m })
        }
        if (res?.audio || res?.mp3) {
            return sock.sendMessage(m.key.remoteJid, { audio: { url: res.audio || res.mp3 }, mimetype: 'audio/mpeg' }, { quoted: m })
        }
        return m.reply('❌ No result found')
    } catch {
        return m.reply('❌ Download failed')
    }
}

async function cmd_play(sock, m) {
    const text = m.text.split(' ').slice(1).join(' ') || (m.quoted ? m.quoted.text : '')
    if (!text) return m.reply('Use: .play song name')
    try {
        const { data } = await axios.get(`https://api.davidcyriltech.my.id/youtube/mp3?title=${encodeURIComponent(text)}`)
        const url = data?.result?.download?.url || data?.result?.link || data?.url
        if (url) {
            const title = data?.result?.title || text
            return sock.sendMessage(m.key.remoteJid, { audio: { url }, mimetype: 'audio/mpeg', contextInfo: { externalAdReply: { title: title, body: 'X NOBITA MD', mediaType: 1, thumbnailUrl: data?.result?.thumbnail } } }, { quoted: m })
        }
        return m.reply('❌ Not found')
    } catch {
        return m.reply('❌ Failed')
    }
}

async function cmd_song(sock, m) { return cmd_play(sock, m) }

async function cmd_yta(sock, m) {
    const text = m.text.split(' ').slice(1).join(' ')
    if (!text) return m.reply('Use: .yta https://youtube.com/watch?v=...')
    try {
        const { data } = await axios.get(`https://api.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(text)}`)
        const url = data?.result?.download?.url || data?.result?.link
        if (url) return sock.sendMessage(m.key.remoteJid, { audio: { url }, mimetype: 'audio/mpeg' }, { quoted: m })
        return m.reply('❌ Not found')
    } catch {
        return m.reply('❌ Failed')
    }
}

async function cmd_ytmp3(sock, m) { return cmd_yta(sock, m) }

async function cmd_yts(sock, m) {
    const text = m.text.split(' ').slice(1).join(' ')
    if (!text) return m.reply('Use: .yts song name')
    try {
        const { data } = await axios.get(`https://api.davidcyriltech.my.id/youtube/search?q=${encodeURIComponent(text)}`)
        const list = (data?.result || []).slice(0, 5).map((v, i) => `${i+1}. ${v.title}\nhttps://youtu.be/${v.videoId}`).join('\n\n')
        return m.reply(`*🔍 YouTube Results*\n\n${list}`)
    } catch {
        return m.reply('❌ Failed')
    }
}

async function cmd_fb(sock, m) {
    const text = m.text.split(' ').slice(1).join(' ')
    if (!text) return m.reply('Use: .fb https://facebook.com/...')
    try {
        const { data } = await axios.get(`https://api.davidcyriltech.my.id/facebook?url=${encodeURIComponent(text)}`)
        const url = data?.result?.download?.url || data?.result?.link
        if (url) return sock.sendMessage(m.key.remoteJid, { video: { url }, caption: '*⬇️ FB Video*' }, { quoted: m })
        return m.reply('❌ Not found')
    } catch {
        return m.reply('❌ Failed')
    }
}

async function cmd_ig(sock, m) {
    const text = m.text.split(' ').slice(1).join(' ')
    if (!text) return m.reply('Use: .ig https://instagram.com/...')
    try {
        const { data } = await axios.get(`https://api.davidcyriltech.my.id/instagram?url=${encodeURIComponent(text)}`)
        const url = data?.result?.download?.url || data?.result?.link
        if (url) return sock.sendMessage(m.key.remoteJid, { video: { url }, caption: '*⬇️ IG Video*' }, { quoted: m })
        return m.reply('❌ Not found')
    } catch {
        return m.reply('❌ Failed')
    }
}

async function cmd_pint(sock, m) {
    const text = m.text.split(' ').slice(1).join(' ')
    if (!text) return m.reply('Use: .pint https://pinterest.com/...')
    try {
        const { data } = await axios.get(`https://api.davidcyriltech.my.id/pinterestdl?url=${encodeURIComponent(text)}`)
        const url = data?.result?.download?.url || data?.result?.link
        if (url) return sock.sendMessage(m.key.remoteJid, { image: { url }, caption: '*⬇️ Pinterest*' }, { quoted: m })
        return m.reply('❌ Not found')
    } catch {
        return m.reply('❌ Failed')
    }
}

async function cmd_mega(sock, m) {
    const text = m.text.split(' ').slice(1).join(' ')
    if (!text) return m.reply('Use: .mega https://mega.nz/...')
    try {
        const { data } = await axios.get(`https://api.davidcyriltech.my.id/mega?url=${encodeURIComponent(text)}`)
        return m.reply(`*⬇️ Mega Link*\n\n${data?.result?.download || data?.result?.link || '❌ Not found'}`)
    } catch {
        return m.reply('❌ Failed')
    }
}

async function cmd_apk(sock, m) {
    const text = m.text.split(' ').slice(1).join(' ')
    if (!text) return m.reply('Use: .apk app name')
    try {
        const { data } = await axios.get(`https://api.davidcyriltech.my.id/apk?name=${encodeURIComponent(text)}`)
        const url = data?.result?.download || data?.result?.link
        if (url) return sock.sendMessage(m.key.remoteJid, { document: { url }, mimetype: 'application/vnd.android.package-archive', fileName: `${text}.apk`, caption: `*⬇️ ${text}*` }, { quoted: m })
        return m.reply('❌ Not found')
    } catch {
        return m.reply('❌ Failed')
    }
}

async function cmd_git(sock, m) {
    const text = m.text.split(' ').slice(1).join(' ')
    if (!text) return m.reply('Use: .git username')
    try {
        const { data } = await axios.get(`https://api.github.com/users/${text}`)
        return m.reply(`*🐙 GitHub: ${data.login}*\n\n👤 Name: ${data.name || 'N/A'}\n📦 Repos: ${data.public_repos}\n👥 Followers: ${data.followers}\n🔗 ${data.html_url}`)
    } catch {
        return m.reply('❌ User not found')
    }
}

async function cmd_gitclone(sock, m) {
    const text = m.text.split(' ').slice(1).join(' ')
    if (!text) return m.reply('Use: .gitclone https://github.com/user/repo')
    try {
        const url = text.replace('.git', '') + '/archive/refs/heads/main.zip'
        return sock.sendMessage(m.key.remoteJid, { document: { url }, mimetype: 'application/zip', fileName: 'repo.zip', caption: '*⬇️ Repo ZIP*' }, { quoted: m })
    } catch {
        return m.reply('❌ Failed')
    }
}

async function cmd_url(sock, m) {
    const text = m.text.split(' ').slice(1).join(' ')
    if (!text) return m.reply('Use: .url https://...')
    try {
        const { data } = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(text)}`)
        return m.reply(`*🔗*\n\n${data}`)
    } catch {
        return m.reply('❌ Failed')
    }
}

module.exports = { play: cmd_play, song: cmd_song, yta: cmd_yta, ytmp3: cmd_ytmp3, yts: cmd_yts, fb: cmd_fb, ig: cmd_ig, pint: cmd_pint, mega: cmd_mega, apk: cmd_apk, git: cmd_git, gitclone: cmd_gitclone, url: cmd_url }
