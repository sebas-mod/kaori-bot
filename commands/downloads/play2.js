import axios from 'axios'
import FormData from 'form-data'
import yts from 'yt-search'

export default {
  command: ['play2', 'ytmp3v2', 'playbackup'],
  category: 'downloader',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      if (!args[0]) {
        return m.reply(`✧ Ejemplo:\n${usedPrefix + command} Joji - Glimpse of Us`)
      }

      let text = args.join(' ')
      let url = text

      // 🔎 Buscar si no es URL
      if (!text.includes('youtube.com') && !text.includes('youtu.be')) {
        const search = await yts(text)
        if (!search.videos.length) {
          return m.reply('❌ No se encontraron resultados')
        }
        url = search.videos[0].url
      }

      await m.react('🕒')

      const result = await youtubeScraper.youtubeMp3(url)

      if (!result.success) {
        await m.react('❌')
        return m.reply(`❌ Error: ${result.error.message}`)
      }

      await client.sendMessage(
        m.chat,
        {
          audio: { url: result.data.downloadUrl },
          mimetype: 'audio/mpeg',
          fileName: result.data.title || 'audio.mp3'
        },
        { quoted: m }
      )

      await m.react('✅')

    } catch (e) {
      console.error(e)
      await m.react('❌')
      m.reply('❌ Error al procesar la descarga')
    }
  }
}

// 🔥 SCRAPER
class Success {
  constructor(data) {
    this.success = true
    this.data = data
  }
}

class ErrorResponse {
  constructor(error) {
    this.success = false
    this.error = error
  }
}

const youtubeScraper = {
  youtubeMp3: async (url) => {
    try {
      if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
        return new ErrorResponse({ message: "URL inválida" })
      }

      const form = new FormData()
      form.append("url", url)

      const { data } = await axios.post(
        "https://www.youtubemp3.ltd/convert",
        form,
        {
          headers: {
            ...form.getHeaders(),
            'User-Agent': 'Mozilla/5.0'
          },
          timeout: 45000
        }
      )

      if (!data?.link) {
        return new ErrorResponse({ message: "No se pudo obtener el audio" })
      }

      return new Success({
        title: data.filename || "audio.mp3",
        downloadUrl: data.link
      })

    } catch (error) {
      return new ErrorResponse({
        message: error.message || "Error desconocido"
      })
    }
  }
}
