const axios = require('axios')

async function cmd_copilot(sock, m) {
    const text = m.text.split(' ').slice(1).join(' ') || (m.quoted ? m.quoted.text : '')
    if (!text) return m.reply('Use: .copilot hi how are you')
    try {
        const { data } = await axios.get(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|en`)
        const { data: gdata } = await axios.post('https://api.openai-proxy.workers.dev/v1/chat/completions', {
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: text }]
        }).catch(() => ({ data: null }))
        if (gdata?.choices?.[0]) return m.reply(`*🤖 Copilot*\n\n${gdata.choices[0].message.content}`)
        return m.reply('❌ AI unavailable right now')
    } catch {
        return m.reply('❌ Failed')
    }
}

async function cmd_gpt(sock, m) {
    const text = m.text.split(' ').slice(1).join(' ') || (m.quoted ? m.quoted.text : '')
    if (!text) return m.reply('Use: .gpt what is javascript')
    try {
        const { data } = await axios.post('https://api.openai-proxy.workers.dev/v1/chat/completions', {
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: text }]
        })
        return m.reply(`*🧠 GPT*\n\n${data?.choices?.[0]?.message?.content || '❌ No response'}`)
    } catch {
        return m.reply('❌ Failed')
    }
}

async function cmd_achar(sock, m) {
    const text = m.text.split(' ').slice(1).join(' ')
    if (!text) return m.reply('Use: .achar hi')
    try {
        const { data } = await axios.post('https://api.openai-proxy.workers.dev/v1/chat/completions', {
            model: 'gpt-4o-mini',
            messages: [{ role: 'system', content: 'Act as A-Chat, a friendly bot. Reply short.' }, { role: 'user', content: text }]
        })
        return m.reply(`*💬 A-Chat*\n\n${data?.choices?.[0]?.message?.content || '❌ No response'}`)
    } catch {
        return m.reply('❌ Failed')
    }
}

async function cmd_aquote(sock, m) {
    try {
        const { data } = await axios.get('https://api.quotable.io/random')
        return m.reply(`*💭 Quote*\n\n"${data?.content}"\n— ${data?.author}`)
    } catch {
        return m.reply('❌ Failed')
    }
}

async function cmd_arecommend(sock, m) {
    try {
        const recs = [
            '🎬 Movie: Watch "Interstellar" tonight',
            '📺 Series: Try "Dark" on Netflix',
            '🎵 Song: Listen to "Blinding Lights" — The Weeknd',
            '📖 Book: Read "Atomic Habits" by James Clear',
            '🎮 Game: Try "Hollow Knight"',
            '🍕 Food: Try making homemade pasta'
        ]
        const pick = recs[Math.floor(Math.random() * recs.length)]
        return m.reply(`*✨ Recommendation*\n\n${pick}`)
    } catch {
        return m.reply('❌ Failed')
    }
}

async function cmd_asearch(sock, m) {
    const text = m.text.split(' ').slice(1).join(' ')
    if (!text) return m.reply('Use: .asearch whatsapp bot')
    try {
        const { data } = await axios.get(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(text)}`)
        const results = []
        const regex = /<a[^>]+class="result__a"[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>.*?<a[^>]+class="result__snippet"[^>]*>(.*?)<\/a>/gi
        let match
        let count = 0
        while ((match = regex.exec(data)) !== null && count < 5) {
            results.push(`*${match[2].replace(/<[^>]+>/g, '')}*\n${match[3].replace(/<[^>]+>/g, '').slice(0, 120)}\n${decodeURIComponent(match[1])}\n`)
            count++
        }
        if (!results.length) return m.reply('❌ No results')
        return m.reply(`*🔍 Search Results*\n\n${results.join('')}`)
    } catch {
        return m.reply('❌ Failed')
    }
}

module.exports = { copilot: cmd_copilot, gpt: cmd_gpt, achar: cmd_achar, aquote: cmd_aquote, arecommend: cmd_arecommend, asearch: cmd_asearch }
