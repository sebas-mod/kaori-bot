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
      const conn = ctx.conn || ctx.client || global.conn

      if (!conn) return m.reply('❌ Error de conexión.')

      const user = m.sender

      // 🔥 NO usamos groupMetadata para evitar crash
      // solo intentamos promover directo

      await conn.groupParticipantsUpdate(m.chat, [user], 'promote')

      if (m.react) await m.react('✅')

      await conn.sendMessage(m.chat, {
        text: '✧ *Ahora eres administrador.*'
      }, { quoted: m })

    } catch (e) {
      console.error(e)

      // Mensaje más claro según error
      if (e.message.includes('not-authorized')) {
        return m.reply('❌ *El bot no es administrador.*')
      }

      if (e.message.includes('jid')) {
        return m.reply('❌ *Error interno del bot (jid).*')
      }

      m.reply('✦ Ocurrió un error.')
    }
  }
}
