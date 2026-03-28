// ✧ Auto Admin (Owner Only)

export default {
  command: ['dameadmin'],
  category: 'owner',
  botAdmin: true,
  group: true,

  run: async (client, m) => {
    try {
      // Obtener metadata
      const metadata = await client.groupMetadata(m.chat)

      const user = m.sender
      const bot = client.user.id.split(':')[0] + '@s.whatsapp.net'

      // Verificar si el bot es admin
      const isBotAdmin = metadata.participants.some(p => 
        p.id === bot || p.jid === bot || p.lid === bot
      )

      if (!isBotAdmin) {
        return client.reply(m.chat, '❌ El bot no es administrador.', m)
      }

      // Verificar si ya eres admin
      const isUserAdmin = metadata.participants.some(p => 
        p.id === user || p.jid === user || p.lid === user
      )

      if (isUserAdmin) {
        return client.reply(m.chat, '✧ Ya eres administrador.', m)
      }

      // Dar admin
      await client.groupParticipantsUpdate(m.chat, [user], 'promote')

      await m.react('✅')
      await client.reply(m.chat, '✧ Ahora eres administrador.', m)

    } catch (e) {
      console.error(e)
      await m.react('✖️')
      client.reply(m.chat, `❌ Error: ${e.message}`, m)
    }
  }
}
