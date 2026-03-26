let handler = {
  command: ['simulate', 'sim', 'simulacion'],
  category: 'group',

  run: async (client, m, args, usedPrefix, command, { isOwner }) => {

    // 🔒 SOLO OWNER
    if (!global.owner.includes(m.sender.split('@')[0])) {
  return m.reply('❌ Solo el owner puede usar esto.')
   }

    if (!m.isGroup) {
      return m.reply('❌ Solo en grupos.')
    }

    const evento = args[0]
    if (!evento) {
      return m.reply(
        `🧩 Uso:\n` +
        `${usedPrefix + command} welcome @user\n` +
        `${usedPrefix + command} bye @user\n` +
        `${usedPrefix + command} promote @user\n` +
        `${usedPrefix + command} demote @user\n` +
        `${usedPrefix + command} desc`
      )
    }

    let users = m.mentionedJid?.length ? m.mentionedJid : [m.sender]

    await m.reply(`⚡ Simulando ${evento}...`)

    for (let user of users) {

      let anu = {
        id: m.chat,
        participants: [user],
        action: ''
      }

      switch (evento.toLowerCase()) {
        case 'welcome':
        case 'add':
          anu.action = 'add'
          break

        case 'bye':
        case 'remove':
          anu.action = 'remove'
          break

        case 'promote':
          anu.action = 'promote'
          anu.author = m.sender
          break

        case 'demote':
          anu.action = 'demote'
          anu.author = m.sender
          break

        case 'desc':
          // ⚠️ esto usa messageStubType
          await client.ev.emit('messages.upsert', {
            messages: [{
              key: {
                remoteJid: m.chat,
                fromMe: false,
                participant: m.sender
              },
              messageStubType: 24,
              messageStubParameters: ['Nueva descripción']
            }],
            type: 'notify'
          })
          continue

        default:
          return m.reply('❌ Evento inválido.')
      }

      // 🚀 DISPARAR EVENTO REAL
      await client.ev.emit('group-participants.update', anu)
    }
  }
}

export default handler
