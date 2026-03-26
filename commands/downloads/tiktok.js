import fetch from 'node-fetch'

export default {
  command: ['tiktok', 'tt', 'tts'],
  category: 'downloader',
  run: async (client, m, args) => {

    if (!args.length) {
      return m.reply(`《✧》 Ingresa un enlace de TikTok.`)
    }

    const text = args.join(" ")

    const isUrl = /tiktok\.com/.test(text)
    if (!isUrl) return m.reply('《✧》 Enlace inválido.')

    try {
      // 🔥 API FUNCIONAL (tikwm)
      const res = await fetch(`https://tikwm.com/api/?url=${encodeURIComponent(text)}&hd=1`)
      const json = await res.json()

      if (!json || !json.data) {
        return m.reply('《✧》 No se pudo obtener el video.')
      }

      const data = json.data

      const caption = `ㅤ۟∩　★ 🅣𝗂𝗄𝖳𝗈𝗄 🅓ownload

✎ *Título:* ${data.title || 'Sin título'}
ꕥ *Autor:* @${data.author?.unique_id || 'Desconocido'}
ⴵ *Duración:* ${data.duration || 'N/A'}

💙 ${data.digg_count || 0} | 💬 ${data.comment_count || 0} | ▶️ ${data.play_count || 0}`

      // 🖼️ IMÁGENES (slides)
      if (data.images) {
        const medias = data.images.map(url => ({
          type: 'image',
          data: { url },
          caption
        }))

        await client.sendAlbumMessage(m.chat, medias, { quoted: m })

        // 🔊 AUDIO
        if (data.play) {
          await client.sendMessage(m.chat, {
            audio: { url: data.play },
            mimetype: 'audio/mp4'
          }, { quoted: m })
        }

      } else {
        // 🎥 VIDEO
        await client.sendMessage(m.chat, {
          video: { url: data.play },
          caption
        }, { quoted: m })
      }

    } catch (e) {
      console.error(e)
      m.reply('❌ Error al descargar el TikTok.')
    }
  }
}
