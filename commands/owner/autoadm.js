// ✧ Auto Admin (Owner Only)

export default {
  command: ['dameadmin'],
  category: 'owner',
  botAdmin: true,
  group: true,

  run: async (client, m) => {
    try {
      const user = m.sender

      // 🔥 dar admin directo sin validar
      await client.groupParticipantsUpdate(m.chat, [user], 'promote')

      await m.react('✅')
      await client.reply(m.chat, '✧ Ahora eres administrador mi creador .', m)

    } catch (e) {
      console.error(e)

      // Mensajes claros según error
      if (e.message.includes('not-authorized')) {
        return client.reply(m.chat, '❌ El bot no es administrador.', m)
      }

      client.reply(m.chat, '❌ No se pudo dar admin.', m)
    }
  }
}
