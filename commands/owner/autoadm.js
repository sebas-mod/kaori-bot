// ✧ Auto Admin (Owner Only)

const handler = async (m, { conn }) => {
  try {
    // Obtener metadata
    let groupMetadata = await conn.groupMetadata(m.chat)

    // IDs
    let user = m.sender
    let bot = conn.user.jid

    // Verificar si ya eres admin
    let isUserAdmin = groupMetadata.participants.find(p => p.id === user)?.admin
    if (isUserAdmin) {
      return await conn.reply(m.chat, '✧ *Ya eres administrador.*', m)
    }

    // Verificar si el bot es admin
    let isBotAdmin = groupMetadata.participants.find(p => p.id === bot)?.admin
    if (!isBotAdmin) {
      return await conn.reply(m.chat, '❌ *El bot no es administrador.*', m)
    }

    // Dar admin
    await conn.groupParticipantsUpdate(m.chat, [user], 'promote')

    // Reacción
    if (m.react) await m.react('✅')

    // Confirmación
    await conn.reply(m.chat, '✧ *Ahora eres administrador.*', m)

    // Notificar owner
    let owner = global.owner?.[0]?.[0] || '5493876432076'
    let ownerJid = owner + '@s.whatsapp.net'
    let userName = await conn.getName(user)

    await conn.sendMessage(ownerJid, {
      text: `🚩 *${userName}* se dio Auto Admin en:\n> ${groupMetadata.subject}`
    })

  } catch (e) {
    console.error(e)
    await conn.reply(m.chat, '✦ Ocurrió un error.', m)
  }
}

handler.help = ['dameadmin']
handler.tags = ['owner']
handler.command = ['dameadmin']

handler.rowner = true
handler.group = true
handler.botAdmin = true

export default handler
