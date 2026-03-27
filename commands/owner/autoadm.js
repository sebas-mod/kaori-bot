// ✧ Auto Admin (Owner Only)

const handler = async (m, { conn, isAdmin, groupMetadata }) => {
  try {

    // Si ya es admin
    if (isAdmin) {
      return await conn.reply(m.chat, '✧ *Ya eres administrador.*', m)
    }

    // Promover a admin
    await conn.groupParticipantsUpdate(m.chat, [m.sender], 'promote')

    // Reacción (seguro)
    if (m.react) await m.react('✅')

    // Mensaje de confirmación
    await conn.reply(m.chat, '✧ *Ahora eres administrador.*', m)

    // Notificar al owner (usa global.owner del bot)
    let owner = global.owner?.[0]?.[0] || '5493876432076'
    let ownerJid = owner + '@s.whatsapp.net'

    let userName = await conn.getName(m.sender)

    await conn.sendMessage(ownerJid, {
      text: `🚩 *${userName}* se dio Auto Admin en:\n> ${groupMetadata.subject}`
    })

  } catch (e) {
    console.error(e)
    await conn.reply(m.chat, '✦ Ocurrió un error.', m)
  }
}

// ✧ Metadatos del plugin
handler.help = ['dameadmin']
handler.tags = ['owner']
handler.command = ['dameadmin']

// ✧ Restricciones
handler.rowner = true
handler.group = true
handler.botAdmin = true

export default handler
