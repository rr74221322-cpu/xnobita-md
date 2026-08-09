const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter')

async function makeSticker(sock, m, opts = {}) {
    try {
        const media = m.quoted ? await m.quoted.download() : null
        if (!media) return m.reply('❌ Reply an image/video with this command')
        const sticker = new Sticker(media, { pack: global.packname || 'X NOBITA MD', author: global.author || 'X NOBITA MD', type: opts.type || StickerTypes.FULL, quality: 75 })
        const buffer = await sticker.toBuffer()
        return sock.sendMessage(m.key.remoteJid, { sticker: buffer }, { quoted: m })
    } catch {
        return m.reply('❌ Failed to make sticker')
    }
}

async function cmd_sticker(sock, m) { return makeSticker(sock, m) }
async function cmd_s(sock, m) { return makeSticker(sock, m) }

async function cmd_take(sock, m) {
    try {
        const media = m.quoted ? await m.quoted.download() : null
        if (!media) return m.reply('❌ Reply a sticker with .take')
        const sticker = new Sticker(media, { pack: global.packname || 'X NOBITA MD', author: global.author || 'X NOBITA MD', type: StickerTypes.FULL, quality: 75 })
        const buffer = await sticker.toBuffer()
        return sock.sendMessage(m.key.remoteJid, { sticker: buffer }, { quoted: m })
    } catch {
        return m.reply('❌ Failed')
    }
}

async function cmd_toimage(sock, m) {
    try {
        const media = m.quoted ? await m.quoted.download() : null
        if (!media) return m.reply('❌ Reply a sticker')
        const { execSync } = require('child_process')
        const fs = require('fs')
        const path = require('path')
        const tmp = path.join('/tmp', `st_${Date.now()}.webp`)
        const out = path.join('/tmp', `img_${Date.now()}.png`)
        fs.writeFileSync(tmp, media)
        execSync(`dwebp ${tmp} -o ${out}`, { timeout: 20000 })
        if (!fs.existsSync(out)) return m.reply('❌ Conversion failed (install webp-tools)')
        const img = fs.readFileSync(out)
        fs.unlinkSync(tmp); fs.unlinkSync(out)
        return sock.sendMessage(m.key.remoteJid, { image: img, caption: '*Converted to Image*' }, { quoted: m })
    } catch {
        return m.reply('❌ Failed')
    }
}

async function cmd_sticker2img(sock, m) { return cmd_toimage(sock, m) }

async function cmd_video2img(sock, m) {
    try {
        const media = m.quoted ? await m.quoted.download() : null
        if (!media) return m.reply('❌ Reply a video')
        const { execSync } = require('child_process')
        const fs = require('fs')
        const path = require('path')
        const tmp = path.join('/tmp', `vid_${Date.now()}.mp4`)
        const out = path.join('/tmp', `thumb_${Date.now()}.jpg`)
        fs.writeFileSync(tmp, media)
        execSync(`ffmpeg -i ${tmp} -ss 00:00:01 -frames:v 1 ${out}`, { timeout: 30000 })
        const img = fs.readFileSync(out)
        fs.unlinkSync(tmp); fs.unlinkSync(out)
        return sock.sendMessage(m.key.remoteJid, { image: img, caption: '*Video → Image*' }, { quoted: m })
    } catch {
        return m.reply('❌ Failed (install ffmpeg)')
    }
}

async function cmd_vs(sock, m) { return cmd_video2img(sock, m) }

async function cmd_remini(sock, m) {
    try {
        const media = m.quoted ? await m.quoted.download() : null
        if (!media) return m.reply('❌ Reply a low quality image')
        const { uploadToCatbox } = require('../utils')
        const url = await uploadToCatbox(media)
        const { data } = await require('axios').get(`https://api.davidcyriltech.my.id/remini?url=${encodeURIComponent(url)}`)
        return sock.sendMessage(m.key.remoteJid, { image: { url: data?.result || data?.url }, caption: '*✨ HD Enhanced*' }, { quoted: m })
    } catch {
        return m.reply('❌ Failed')
    }
}

async function cmd_imagehelp(sock, m) {
    return m.reply('*Image Tools*\n\n.remini — HD enhance\n.imageinfo — image metadata\n.toimage — sticker → image')
}

async function cmd_imageinfo(sock, m) {
    try {
        const media = m.quoted ? await m.quoted.download() : null
        if (!media) return m.reply('❌ Reply an image')
        return m.reply(`*📷 Info*\n\nSize: ${media.length} bytes\nType: image`)
    } catch {
        return m.reply('❌ Failed')
    }
}

module.exports = { sticker: cmd_sticker, s: cmd_s, take: cmd_take, toimage: cmd_toimage, sticker2img: cmd_sticker2img, video2img: cmd_video2img, vs: cmd_vs, remini: cmd_remini, imagehelp: cmd_imagehelp, imageinfo: cmd_imageinfo }
