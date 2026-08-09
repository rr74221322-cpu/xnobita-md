const axios = require('axios')

// ───────── ANIME COMMANDS ─────────

function animeImgCommand(command) {
    return async function cmd(sock, m) {
        try {
            const { data } = await axios.get(`https://api.waifu.pics/sfw/${command}`)
            return sock.sendMessage(m.key.remoteJid, { image: { url: data.url }, caption: `*${command.toUpperCase()}* ✨` }, { quoted: m })
        } catch {
            return m.reply('❌ Failed to fetch')
        }
    }
}

async function cmd_anime(sock, m) {
    try {
        const { data } = await axios.get('https://api.jikan.moe/v4/anime?q=' + (m.text?.split(' ').slice(1).join(' ') || 'naruto'))
        const a = data.data?.[0]
        if (!a) return m.reply('❌ Not found')
        return sock.sendMessage(m.key.remoteJid, { image: { url: a.images.jpg.image_url }, caption: `*${a.title}*\n⭐ ${a.score} | 📅 ${a.year}\n🎬 Episodes: ${a.episodes}\n📖 ${a.synopsis?.slice(0, 200)}...` }, { quoted: m })
    } catch {
        return m.reply('❌ Failed')
    }
}

async function cmd_manga(sock, m) {
    try {
        const { data } = await axios.get('https://api.jikan.moe/v4/manga?q=' + (m.text?.split(' ').slice(1).join(' ') || 'one piece'))
        const a = data.data?.[0]
        if (!a) return m.reply('❌ Not found')
        return sock.sendMessage(m.key.remoteJid, { image: { url: a.images.jpg.image_url }, caption: `*${a.title}*\n⭐ ${a.score} | 📅 ${a.year}\n📖 ${a.synopsis?.slice(0, 200)}...` }, { quoted: m })
    } catch {
        return m.reply('❌ Failed')
    }
}

async function cmd_character(sock, m) {
    try {
        const { data } = await axios.get('https://api.jikan.moe/v4/characters?q=' + (m.text?.split(' ').slice(1).join(' ') || 'luffy'))
        const a = data.data?.[0]
        if (!a) return m.reply('❌ Not found')
        return sock.sendMessage(m.key.remoteJid, { image: { url: a.images.jpg.image_url }, caption: `*${a.name}*` }, { quoted: m })
    } catch {
        return m.reply('❌ Failed')
    }
}

async function cmd_loli(sock, m) {
    try {
        const { data } = await axios.get('https://api.lolicon.app/setu/v2?r18=0&excludeAI=true')
        return sock.sendMessage(m.key.remoteJid, { image: { url: data.data?.[0]?.urls?.original }, caption: '*LOLI*' }, { quoted: m })
    } catch {
        return m.reply('❌ Failed')
    }
}

// ───────── REACTION COMMANDS ─────────
const gifApi = 'https://tenor.googleapis.com/v2/search'
async function gifCommand(command) {
    return async function cmd(sock, m) {
        try {
            const { data } = await axios.get('https://nekos.best/api/v2/' + command)
            const url = data.results[0].url
            return sock.sendMessage(m.key.remoteJid, { video: { url }, gifPlayback: true, caption: `*${command}* ✨` }, { quoted: m })
        } catch {
            return m.reply('❌ Failed')
        }
    }
}

module.exports = {
    neko: animeImgCommand('waifu'),
    waifu: animeImgCommand('waifu'),
    megumin: animeImgCommand('waifu'),
    shinobu: animeImgCommand('waifu'),
    maid: animeImgCommand('waifu'),
    anime: cmd_anime, manga: cmd_manga, character: cmd_character, loli: cmd_loli,
    // reactions
    angry: gifCommand('neko'), bite: gifCommand('neko'), bleh: gifCommand('neko'), blowkiss: gifCommand('neko'), blush: gifCommand('neko'), bonk: gifCommand('neko'), bored: gifCommand('neko'), carry: gifCommand('neko'), clap: gifCommand('neko'), confused: gifCommand('neko'), cry: gifCommand('neko'), cuddle: gifCommand('neko'), dance: gifCommand('neko'), facepalm: gifCommand('neko'), feed: gifCommand('neko'), handhold: gifCommand('neko'), handshake: gifCommand('neko'), happy: gifCommand('neko'), highfive: gifCommand('neko'), hug: gifCommand('neko'), kabedon: gifCommand('neko'), kick: gifCommand('neko'), kiss: gifCommand('neko'), lappillow: gifCommand('neko'), laugh: gifCommand('neko'), nod: gifCommand('neko'), nom: gifCommand('neko'), nope: gifCommand('neko'), nya: gifCommand('neko'), pat: gifCommand('neko'), peck: gifCommand('neko'), poke: gifCommand('neko'), pout: gifCommand('neko'), punch: gifCommand('neko'), run: gifCommand('neko'), salute: gifCommand('neko'), shake: gifCommand('neko'), shocked: gifCommand('neko'), shrug: gifCommand('neko'), sip: gifCommand('neko'), slap: gifCommand('neko'), smile: gifCommand('neko'), smug: gifCommand('neko'), spin: gifCommand('neko'), stare: gifCommand('neko'), tableflip: gifCommand('neko'), teehee: gifCommand('neko'), think: gifCommand('neko'), thumbsup: gifCommand('neko'), tickle: gifCommand('neko'), wag: gifCommand('neko'), wave: gifCommand('neko'), wink: gifCommand('neko'), yawn: gifCommand('neko'), yeet: gifCommand('neko')
}
