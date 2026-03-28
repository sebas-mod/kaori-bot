// ✧ Auto Admin (Owner Only)

export default {
  name: 'dameadmin',
  command: ['dameadmin'],
  tags: ['owner'],
  help: ['dameadmin'],
  group: true,
  botAdmin: true,
  owner: true,

  run: async (m, ctx) => {
    try {
      // 🔥 Detectar conexión automáticamente
      const conn = ctx.conn || ctx.client || global.conn

      if (!conn) {
        return m.reply('❌ Error: conexión no disponible.')
      }

      // Obtener metadata del grupo
      const metadata = await conn.groupMetadata(m.chat)

      const user = m.sender
      const bot = conn.user.id.split(':')[0] + '@s.whatsapp.net'

      // Verificar si ya es admin
      const isUserAdmin = metadata.participants.find(p => p.id === user)?.admin
      if (isUserAdmin) {
        return conn.sendMessage(m.chat, { text: '✧ *Ya eres administrador.*' }, { quoted: m })
      }

      // Verificar si el bot es admin
      const isBotAdmin = metadata.participants.find(p => p.id === bot)?.admin
      if (!isBotAdmin) {
        return conn.sendMessage(m.chat, { text: '❌ *El bot no es administrador.*' }, { quoted: m })
      }

      // Promover usuario
      await conn.groupParticipantsUpdate(m.chat, [user], 'promote')

      // Reacción
      if (m.react) await m.react('✅')

      // Confirmación
      await conn.sendMessage(m.chat, { text: '✧ *Ahora eres administrador.*' }, { quoted: m })

    } catch (e) {
      console.error(e)
      m.reply('✦ Ocurrió un error.')
    }
  }
}
