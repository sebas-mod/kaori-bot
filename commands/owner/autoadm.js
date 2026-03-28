// ✧ Auto Admin

export default {
  name: 'dameadmin',
  command: ['dameadmin'],
  tags: ['owner'],
  help: ['dameadmin'],
  group: true,
  botAdmin: true,
  owner: true,

  run: async (m, { conn }) => {
    try {
      let groupMetadata = await conn.groupMetadata(m.chat)

      let user = m.sender
      let bot = conn.user.jid

      // Verificar si ya es admin
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

      if (m.react) await m.react('✅')

      await conn.reply(m.chat, '✧ *Ahora eres administrador.*', m)

    } catch (e) {
      console.error(e)
      await conn.reply(m.chat, '✦ Ocurrió un error.', m)
    }
  }
}
