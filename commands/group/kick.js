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
// 🔥 STICKER KICK POR PACK
// =========================
export async function before(m, { client }) {

  if (!m.message?.stickerMessage) return
  if (!m.isGroup) return

  let sticker = m.message.stickerMessage

  // 🔥 TU CONFIG
  const PACK_NAME = "fuiste eliminado por gay"
  const AUTHOR_NAME = "sebas"

  let pack = sticker.packname || ""
  let author = sticker.author || ""

  // 🔍 DEBUG (puedes borrar luego)
  if (pack !== PACK_NAME || author !== AUTHOR_NAME) return

  // 🔒 verificar admin
  let groupInfo = await client.groupMetadata(m.chat)
  let participants = groupInfo.participants

  let isAdmin = participants.find(p =>
    p.id === m.sender &&
    (p.admin === "admin" || p.admin === "superadmin")
  )

  if (!isAdmin) return m.reply("❌ Solo admins pueden usar este sticker")

  // 👇 usuario objetivo
  let user = m.mentionedJid?.[0] || m.quoted?.sender

  if (!user) {
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
    m.reply("❌ Error al eliminar")
  }
}
