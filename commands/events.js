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
      const chat = global?.db?.data?.chats?.[anu.id] || {} // 🔥 FIX
      const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
      const memberCount = metadata.participants.length      
      const isSelf = global.db.data.settings[botId]?.self ?? false
      if (isSelf) return

      for (const p of anu.participants) {
        const jid = p.phoneNumber
        const phone = p.phoneNumber?.split('@')[0] || jid.split('@')[0]

        const mensajes = {
          add: chat?.sWelcome ? `\n┊➤ ${chat.sWelcome.replace(/{usuario}/g, `@${phone}`).replace(/{grupo}/g, `*${metadata.subject}*`).replace(/{desc}/g, metadata?.desc || '✿ Sin Desc ✿')}` : '',
          remove: chat?.sGoodbye ? `\n┊➤ ${chat.sGoodbye.replace(/{usuario}/g, `@${phone}`).replace(/{grupo}/g, `*${metadata.subject}*`).replace(/{desc}/g, metadata?.desc || '✿ Sin Desc ✿')}` : '',
          leave: chat?.sGoodbye ? `\n┊➤ ${chat.sGoodbye.replace(/{usuario}/g, `@${phone}`).replace(/{grupo}/g, `*${metadata.subject}*`).replace(/{desc}/g, metadata?.desc || '✿ Sin Desc ✿')}` : ''
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
              body: 'Sistema de bienvenida',
              previewType: 'PHOTO',
              thumbnailUrl: global.db.data.settings[botId].icon,
              sourceUrl: global.db.data.settings[botId].link,
              mediaType: 1,
              renderLargerThumbnail: false
            },
            mentionedJid: [jid]
          }
        }

        // ✨ WELCOME (SIN BLOQUEOS)
        if (anu.action === 'add') {
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

          // 🔊 Audio
          setTimeout(async () => {
            await client.sendMessage(anu.id, {
              audio: { url: audioURL },
              mimetype: 'audio/ogg; codecs=opus',
              ptt: true
            })
          }, 1000)
        }

        // ✨ DESPEDIDA (SIN AUDIO)
        if (anu.action === 'remove' || anu.action === 'leave') {
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
        if (anu.action === 'promote' && chat?.alerts) {
          const usuario = anu.author
          await client.sendMessage(anu.id, { 
            text: `「✎」 *@${phone}* ha sido promovido por *@${usuario.split('@')[0]}.*`, 
            mentions: [jid, usuario, ...groupAdmins.map(v => v.id)] 
          })
        }

        if (anu.action === 'demote' && chat?.alerts) {
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
}
