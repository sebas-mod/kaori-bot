export default {
  command: ['kick'],
  category: 'grupo',
  isAdmin: true,
  botAdmin: true,

  run: async (client, m, args, usedPrefix, command) => {

    // =========================
    // 🔥 KICK POR STICKER
    // =========================
    if (m.message?.stickerMessage) {

      const stickerAdmin = "ChFslPbBQQOwk+7k3A2k1dgwzzY7HHWCVx9vo6IJIBw="

      let hash = m.message.stickerMessage.fileSha256.toString('base64')

      if (hash === stickerAdmin) {

        if (!m.quoted) {
          return m.reply('❌ Responde al mensaje del usuario que quieres eliminar')
        }

        let user = m.quoted.sender

        const groupInfo = await client.groupMetadata(m.chat)
        const ownerGroup = groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net'
        const ownerBot = global.owner[0][0] + '@s.whatsapp.net'

        if (user === client.decodeJid(client.user.id)) {
          return m.reply('❌ No puedo eliminar al bot')
        }

        if (user === ownerGroup) {
          return m.reply('❌ No puedo eliminar al propietario del grupo')
        }

        if (user === ownerBot) {
          return m.reply('❌ No puedo eliminar al owner del bot')
        }

        try {
          await client.groupParticipantsUpdate(m.chat, [user], 'remove')

          return client.reply(m.chat,
            `🚫 @${user.split('@')[0]} eliminado con sticker`,
            m,
            { mentions: [user] }
          )

        } catch (e) {
          return m.reply('❌ Error al eliminar')
        }
      }
    }

    // =========================
    // 🔴 COMANDO NORMAL .kick
    // =========================
    if (!m.mentionedJid[0] && !m.quoted) {
      return m.reply('《✧》 Etiqueta o responde al *mensaje* de la *persona* que quieres eliminar')
    }

    let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender

    const groupInfo = await client.groupMetadata(m.chat)
    const ownerGroup = groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net'
    const ownerBot = global.owner[0][0] + '@s.whatsapp.net'

    const participant = groupInfo.participants.find(
      (p) => p.phoneNumber === user || p.jid === user || p.id === user || p.lid === user
    )

    if (!participant) {
      return client.reply(
        m.chat,
        `《✧》 *@${user.split('@')[0]}* ya no está en el grupo.`,
        m,
        { mentions: [user] }
      )
    }

    if (user === client.decodeJid(client.user.id)) {
      return m.reply('《✧》 No puedo eliminar al *bot* del grupo')
    }

    if (user === ownerGroup) {
      return m.reply('《✧》 No puedo eliminar al *propietario* del grupo')
    }

    if (user === ownerBot) {
      return m.reply('《✧》 No puedo eliminar al *propietario* del bot')
    }

    try {
      await client.groupParticipantsUpdate(m.chat, [user], 'remove')

      client.reply(
        m.chat,
        `✎ @${user.split('@')[0]} *eliminado* correctamente`,
        m,
        { mentions: [user] }
      )

    } catch (e) {
      return m.reply(
        `> Error ejecutando *${usedPrefix + command}*\n> ${e.message}`
      )
    }
  },
};
