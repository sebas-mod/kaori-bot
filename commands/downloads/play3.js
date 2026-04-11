import yts from 'yt-search'
import fetch from 'node-fetch'
import { getBuffer } from '../../lib/message.js'

const isYTUrl = (url) => /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/i.test(url)

async function getVideoInfo(query, videoMatch) {
  const search = await yts(query)
  if (!search.all.length) return null
  const videoInfo = videoMatch 
    ? search.videos.find(v => v.videoId === videoMatch[1]) || search.all[0] 
    : search.all[0]
  return videoInfo || null
}

export default {
  command: ['play3'],
  category: 'downloader',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      if (!args[0]) {
        return m.reply('《✧》Por favor, menciona el nombre o URL del video que deseas descargar')
      }

      const text = args.join(' ')
      const videoMatch = text.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/|v\/))([a-zA-Z0-9_-]{11})/)
      const query = videoMatch ? 'https://youtu.be/' + videoMatch[1] : text

      let url = query, title = null, thumbBuffer = null

      try {
        const videoInfo = await getVideoInfo(query, videoMatch)
        if (videoInfo) {
          url = videoInfo.url
          title = videoInfo.title
          thumbBuffer = await getBuffer(videoInfo.image)

          const vistas = (videoInfo.views || 0).toLocaleString()
          const canal = videoInfo.author?.name || 'Desconocido'

          const infoMessage = `➩ Descargando › ${title}

> ❖ Canal › *${canal}*
> ⴵ Duración › *${videoInfo.timestamp || 'Desconocido'}*
> ❀ Vistas › *${vistas}*
> ✩ Publicado › *${videoInfo.ago || 'Desconocido'}*
> ❒ Enlace › *${url}*`

          await client.sendMessage(m.chat, { image: thumbBuffer, caption: infoMessage }, { quoted: m })
        }
      } catch (err) {}

      const audio = await getAudioFromNexray(url)

      if (!audio?.url) {
        return m.reply('《✧》 No se pudo descargar el *audio*, intenta más tarde.')
      }

      const audioBuffer = await getBuffer(audio.url)

      await client.sendMessage(
        m.chat,
        {
          audio: audioBuffer,
          fileName: `${title || 'audio'}.mp3`,
          mimetype: 'audio/mpeg'
        },
        { quoted: m }
      )

    } catch (e) {
      await m.reply(`> Error en *${usedPrefix + command}*\n> ${e.message}`)
    }
  }
}

async function getAudioFromNexray(url) {
  try {
    const endpoint = `https://api.nexray.web.id/downloader/ytmp3?url=${encodeURIComponent(url)}`
    const res = await fetch(endpoint).then(r => r.json())
    const link = res?.result?.url
    if (link) return { url: link }
    return null
  } catch (e) {
    return null
  }
}
