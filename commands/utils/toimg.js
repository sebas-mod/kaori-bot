export default {
    command: ['toimg', 'tovideo'],
    category: 'tools',
    run: async (client, m) => {
        const q = m.quoted ? m.quoted : m
        if (!/webp/.test(q.mimetype)) return client.reply(m.chat, '《✧》 Responde a un sticker.', m)

        await m.react('🕒')
        try {
            let media = await q.download()
            if (q.isAnimated) {
                // Si tienes FFmpeg o API libre, esto funcionará
                let videoUrl = `https://api.lolhuman.xyz/api/convert/webptomp4?apikey=GataDios&img=${encodeURIComponent(media.toString('base64'))}`
                await client.sendMessage(m.chat, { video: { url: videoUrl } }, { quoted: m })
            } else {
                await client.sendMessage(m.chat, { image: media }, { quoted: m })
            }
            await m.react('✔️')
        } catch {
            await m.react('✖️')
            client.reply(m.chat, '《✧》 Error: Limitación de servidor detectada.', m)
        }
    }
}
