const { f } = require("../../src/lib/ourin-http")
const te = require('../../src/lib/ourin-error')
const yts = require('yt-search')

const pluginConfig = {
    name: 'play',
    alias: ['ytmp3', 'ytaudio', 'playaudio'],
    category: 'descargas',
    description: 'Descargar audio de YouTube',
    usage: '.play <nombre o url>',
    example: '.play Joji - Glimpse of Us',
    cooldown: 10,
    energi: 1,
    isEnabled: true
}

async function handler(m, { sock }) {
    let text = m.text?.trim()

    if (!text)
        return m.reply(
            `🎵 *DESCARGADOR DE YOUTUBE*\n\n` +
            `╭┈┈⬡「 📋 *CÓMO USAR* 」\n` +
            `┃ \`${m.prefix}play <nombre o url>\`\n` +
            `╰┈┈⬡`
        )

    try {
        m.react('🕕')

        let url = text

        // 🔎 Buscar si no es link
        if (!text.includes('youtube.com') && !text.includes('youtu.be')) {
            const search = await yts(text)
            if (!search.videos.length) {
                return m.reply('❌ No se encontraron resultados')
            }
            url = search.videos[0].url
        }

        // 🔥 API NEXRAY
        const dl = await f(`https://api.nexray.web.id/downloader/ytmp3?url=${encodeURIComponent(url)}`)

        if (!dl?.result?.url) {
            throw 'No se pudo obtener el audio'
        }

        await sock.sendMedia(m.chat, dl.result.url, null, m, {
            type: 'audio',
            mimetype: 'audio/mpeg',
            fileName: dl.result.title || 'audio.mp3',
            contextInfo: {
                externalAdReply: {
                    title: dl.result.title || 'Audio de YouTube',
                    body: 'Descarga completada',
                    thumbnailUrl: dl.result.thumbnail || '',
                    mediaType: 1,
                    sourceUrl: url,
                    mediaUrl: url
                }
            }
        })

        m.react('✅')

    } catch (e) {
        console.error(e)
        m.react('☢')
        m.reply(te(m.prefix, m.command, m.pushName))
    }
}

module.exports = {
    config: pluginConfig,
    handler
}
