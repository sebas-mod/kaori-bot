export default {
  command: ['hidetag', 'tag', 'n'],
  category: 'grupo',
  isAdmin: true,

  run: async (client, m, args, usedPrefix, command) => {
    try {
      const groupMetadata = m.isGroup
        ? await client.groupMetadata(m.chat).catch(() => null)
        : null

      const groupParticipants = groupMetadata?.participants || []

      const mentions = groupParticipants
        .map(p => p.jid || p.id || p.lid || p.phoneNumber)
        .filter(Boolean)
        .map(id => client.decodeJid(id))

      const userText = (args.join(' ') || '').trim()
      const src = m.quoted || m
      const isQuoted = Boolean(m.quoted)

      const getText = (msg) => {
        if (!msg) return ''
        if (typeof msg === 'string') return msg
        if (msg.conversation) return msg.conversation
        if (msg.extendedTextMessage?.text) return msg.extendedTextMessage.text
        if (msg.imageMessage?.caption) return msg.imageMessage.caption
        if (msg.videoMessage?.caption) return msg.videoMessage.caption
        return ''
      }

      const originalText = getText(src.message || src).trim()

      const hasImage = Boolean(src.message?.imageMessage || src.mtype === 'imageMessage')
      const hasVideo = Boolean(src.message?.videoMessage || src.mtype === 'videoMessage')
      const hasAudio = Boolean(src.message?.audioMessage || src.mtype === 'audioMessage')
      const hasSticker = Boolean(src.message?.stickerMessage || src.mtype === 'stickerMessage')

      const options = { quoted: null, mentions }

      if (hasImage || hasVideo) {
        const media = await src.download().catch(() => null)
        if (!media) throw new Error('No se pudo descargar el medio')

        return client.sendMessage(m.chat, {
          ...(hasImage ? { image: media } : { video: media, mimetype: 'video/mp4' }),
          ...(isQuoted
            ? (originalText ? { caption: originalText } : {})
            : (userText ? { caption: userText } : {})
          ),
          ...options
        })
      }

      if (hasAudio) {
        const media = await src.download().catch(() => null)
        if (!media) throw new Error('No se pudo descargar el audio')

        return client.sendMessage(m.chat, {
          audio: media,
          mimetype: 'audio/mp4',
          fileName: 'hidetag.mp3',
          ...options
        })
      }

      if (hasSticker) {
        const media = await src.download().catch(() => null)
        if (!media) throw new Error('No se pudo descargar el sticker')

        return client.sendMessage(m.chat, {
          sticker: media,
          ...options
        })
      }

      if (isQuoted && originalText) {
        return client.sendMessage(m.chat, {
          text: originalText,
          ...options
        })
      }

      if (userText) {
        return client.sendMessage(m.chat, {
          text: userText,
          ...options
        })
      }

      return m.reply(`《✧》 *Ingresa* un texto o *responde* a uno`)

    } catch (e) {
      return m.reply(`> Error al ejecutar *${usedPrefix + command}*\n> ${e.message}`)
    }
  }
}
