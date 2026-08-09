const axios = require('axios')

async function cmd_wiki(sock, m) {
    const text = m.text.split(' ').slice(1).join(' ')
    if (!text) return m.reply('Use: .wiki javascript')
    try {
        const { data } = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(text)}`)
        return m.reply(`*📚 Wikipedia*\n\n*${data.title}*\n\n${data.extract?.slice(0, 400)}\n\n${data.content_urls?.desktop?.page || ''}`)
    } catch {
        return m.reply('❌ Not found')
    }
}

async function cmd_lyrics(sock, m) {
    const text = m.text.split(' ').slice(1).join(' ')
    if (!text) return m.reply('Use: .lyrics song name')
    try {
        const { data } = await axios.get(`https://api.davidcyriltech.my.id/lyrics?query=${encodeURIComponent(text)}`)
        const res = data?.result || data
        if (res?.lyrics) return m.reply(`*🎵 ${res.title || text}*\n\n${res.lyrics.slice(0, 500)}`)
        return m.reply('❌ Not found')
    } catch {
        return m.reply('❌ Failed')
    }
}

async function cmd_weather(sock, m) {
    const text = m.text.split(' ').slice(1).join(' ')
    if (!text) return m.reply('Use: .weather dhaka')
    try {
        const { data } = await axios.get(`https://wttr.in/${encodeURIComponent(text)}?format=j1`)
        const c = data?.current_condition?.[0]
        if (!c) return m.reply('❌ Not found')
        return m.reply(`*🌤️ Weather: ${text}*\n\n🌡️ ${c.temp_C}°C (feels ${c.FeelsLikeC}°C)\n💧 Humidity: ${c.humidity}%\n🌬️ Wind: ${c.windspeedKmph} km/h\n☁️ ${c.weatherDesc?.[0]?.value}`)
    } catch {
        return m.reply('❌ Failed')
    }
}

module.exports = { wiki: cmd_wiki, lyrics: cmd_lyrics, weather: cmd_weather }
