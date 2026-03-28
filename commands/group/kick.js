export default {
  command: ['kick'],
  category: 'grupo',
  isAdmin: true,
  botAdmin: true,

  run: async (client, m, args, usedPrefix, command) => {

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
}


// =========================
// 🔥 STICKER KICK (FIX REAL)
// =========================
export async function before(m, { client }) {

  if (!m.message?.stickerMessage) return
  if (!m.isGroup) return

  // 🔥 TU HASH REAL (STRING)
  const stickerAdmin = "142,58,27,1,229,56,29,57,97,161,239,245,41,75,168,82,23,233,47,18,77,117,253,81,179,95,255,227,130,152,248,78"

  let fileSha = m.message.stickerMessage.fileSha256

  // 🔥 convertir a string
  let hash = Array.from(fileSha).join(',')

  if (hash !== stickerAdmin) return

  // 🔒 verificar admin
  let groupInfo = await client.groupMetadata(m.chat)
  let participants = groupInfo.participants

  let isAdmin = participants.find(p =>
    p.id === m.sender &&
    (p.admin === "admin" || p.admin === "superadmin")
  )

  if (!isAdmin) return m.reply("❌ Solo admins pueden usar este sticker")

  // 👇 usuario objetivo
  let user

  if (m.mentionedJid?.[0]) {
    user = m.mentionedJid[0]
  } else if (m.quoted) {
    user = m.quoted.sender
  } else {
    return m.reply("❌ Responde o etiqueta al usuario")
  }

  const ownerGroup = groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net'
  const ownerBot = global.owner[0][0] + '@s.whatsapp.net'

  if (user === client.decodeJid(client.user.id)) {
    return m.reply("❌ No puedo eliminar al bot")
  }

  if (user === ownerGroup) {
    return m.reply("❌ No puedo eliminar al owner del grupo")
  }

  if (user === ownerBot) {
    return m.reply("❌ No puedo eliminar al owner del bot")
  }

  try {
    await client.groupParticipantsUpdate(m.chat, [user], "remove")

    await client.sendMessage(m.chat, {
      text: `🚫 @${user.split('@')[0]} eliminado con sticker`,
      mentions: [user]
    })

  } catch (e) {
    console.log(e)
    m.reply("❌ Error al eliminar (soy admin?)")
  }
}
