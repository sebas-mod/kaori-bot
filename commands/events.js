import fetch from 'node-fetch'
let WAMessageStubType = (await import('@whiskeysockets/baileys')).default
import chalk from 'chalk'

// 🔥 CONFIGURACIÓN
const bannerURL = 'https://imagenes-one.vercel.app/banner.jpg'
const audioURL = 'https://imagenes-one.vercel.app/bienvenido-wey.opus'

export default async (client, m) => {
  client.ev.on('group-participants.update', async (anu) => {
    try {
      const metadata = await client.groupMetadata(anu.id).catch(() => null)
      const groupAdmins = metadata?.participants.filter(p => (p.admin === 'admin' || p.admin === 'superadmin')) || []
      const chat = global?.db?.data?.chats?.[anu.id]
      const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
      const primaryBotId = chat?.primaryBot
      const memberCount = metadata.participants.length      
      const isSelf = global.db.data.settings[botId]?.self ?? false
      if (isSelf) return

      for (const p of anu.participants) {
        const jid = p.phoneNumber
        const phone = p.phoneNumber?.split('@')[0] || jid.split('@')[0]

        const mensajes = {
          add: chat.sWelcome ? `\n┊➤ ${chat.sWelcome.replace(/{usuario}/g, `@${phone}`).replace(/{grupo}/g, `*${metadata.subject}*`).replace(/{desc}/g, metadata?.desc || '✿ Sin Desc ✿')}` : '',
          remove: chat.sGoodbye ? `\n┊➤ ${chat.sGoodbye.replace(/{usuario}/g, `@${phone}`).replace(/{grupo}/g, `*${metadata.subject}*`).replace(/{desc}/g, metadata?.desc || '✿ Sin Desc ✿')}` : '',
          leave: chat.sGoodbye ? `\n┊➤ ${chat.sGoodbye.replace(/{usuario}/g, `@${phone}`).replace(/{grupo}/g, `*${metadata.subject}*`).replace(/{desc}/g, metadata?.desc || '✿ Sin Desc ✿')}` : ''
        }

        const fakeContext = {
          contextInfo: {
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: global.db.data.settings[botId].id,
              serverMessageId: '0',
              newsletterName: global.db.data.settings[botId].nameid
            },
            externalAdReply: {
              title: global.db.data.settings[botId].namebot,
              body: dev,
              previewType: 'PHOTO',
              thumbnailUrl: global.db.data.settings[botId].icon,
              sourceUrl: global.db.data.settings[botId].link,
              mediaType: 1,
              renderLargerThumbnail: false
            },
            mentionedJid: [jid]
          }
        }

        // ✨ WELCOME
        if (anu.action === 'add' && chat?.welcome && (!primaryBotId || primaryBotId === botId)) {
          const caption = `╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Bienvenido (⁠ ⁠ꈍ⁠ᴗ⁠ꈍ⁠)* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Nombre ›* @${phone}
┊  *Grupo ›* ${metadata.subject}
┊┈─────̇─̇─̇─────◯◝
┊➤ *Usa /menu para ver los comandos.*
┊➤ *Ahora somos ${memberCount} miembros.* ${mensajes.add}
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯`

          // 📸 Banner
          await client.sendMessage(anu.id, { 
            image: { url: bannerURL }, 
            caption, 
            ...fakeContext 
          })

          // 🔊 Audio (solo welcome)
          setTimeout(async () => {
            await client.sendMessage(anu.id, {
              audio: { url: audioURL },
              mimetype: 'audio/ogg; codecs=opus',
              ptt: true
            })
          }, 1000)
        }

        // ✨ DESPEDIDA (SIN AUDIO)
        if ((anu.action === 'remove' || anu.action === 'leave') && chat?.goodbye && (!primaryBotId || primaryBotId === botId)) {
          const caption = `╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Hasta pronto (⁠╥⁠﹏⁠╥⁠)* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Nombre ›* @${phone}
┊  *Grupo ›* ${metadata.subject}
┊┈─────̇─̇─̇─────◯◝
┊➤ *Ojalá que vuelva pronto.*
┊➤ *Ahora somos ${memberCount} miembros.* ${mensajes.remove}
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯`

          await client.sendMessage(anu.id, { 
            image: { url: bannerURL }, 
            caption, 
            ...fakeContext 
          })
        }

        // ALERTAS
        if (anu.action === 'promote' && chat?.alerts && (!primaryBotId || primaryBotId === botId)) {
          const usuario = anu.author
          await client.sendMessage(anu.id, { 
            text: `「✎」 *@${phone}* ha sido promovido por *@${usuario.split('@')[0]}.*`, 
            mentions: [jid, usuario, ...groupAdmins.map(v => v.id)] 
          })
        }

        if (anu.action === 'demote' && chat?.alerts && (!primaryBotId || primaryBotId === botId)) {
          const usuario = anu.author
          await client.sendMessage(anu.id, { 
            text: `「✎」 *@${phone}* ha sido degradado por *@${usuario.split('@')[0]}.*`, 
            mentions: [jid, usuario, ...groupAdmins.map(v => v.id)] 
          })
        }
      }

    } catch (err) {
      console.log(chalk.gray(`[ BOT ] → ${err}`))
    }
  })

  client.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0]
    if (!m.messageStubType) return
    const id = m.key.remoteJid
    const chat = global.db.data.chats[id]
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const primaryBotId = chat?.primaryBot
    if (!chat?.alerts || (primaryBotId && primaryBotId !== botId)) return
    const isSelf = global.db.data.settings[botId]?.self ?? false
    if (isSelf) return

    const actor = m.key?.participant || m.participant || m.key?.remoteJid
    const phone = actor.split('@')[0]
    const groupMetadata = await client.groupMetadata(id).catch(() => null)
    const groupAdmins = groupMetadata?.participants.filter(p => (p.admin === 'admin' || p.admin === 'superadmin')) || []

    if (m.messageStubType == 21) {
      await client.sendMessage(id, { text: `「✎」 @${phone} cambió el nombre del grupo a *${m.messageStubParameters[0]}*`, mentions: [actor, ...groupAdmins.map(v => v.id)] })
    }
    if (m.messageStubType == 22) {
      await client.sendMessage(id, { text: `「✎」 @${phone} cambió el icono del grupo.`, mentions: [actor, ...groupAdmins.map(v => v.id)] })
    }
    if (m.messageStubType == 23) {
      await client.sendMessage(id, { text: `「✎」 @${phone} restableció el enlace del grupo.`, mentions: [actor, ...groupAdmins.map(v => v.id)] })
    }
    if (m.messageStubType == 24) {
      await client.sendMessage(id, { text: `「✎」 @${phone} cambió la descripción del grupo.`, mentions: [actor, ...groupAdmins.map(v => v.id)] })
    }
    if (m.messageStubType == 25) {
      await client.sendMessage(id, { text: `「✎」 @${phone} cambió ajustes del grupo.`, mentions: [actor, ...groupAdmins.map(v => v.id)] })
    }
    if (m.messageStubType == 26) {
      await client.sendMessage(id, { text: `「✎」 @${phone} cambió permisos de mensajes.`, mentions: [actor, ...groupAdmins.map(v => v.id)] })
    }
  })
}
