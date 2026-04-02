import fetch from 'node-fetch';

export default {
  command: ['mute', 'unmute'],
  category: 'grupo',
  isAdmin: true,
  botAdmin: true,

  run: async (client, m, args, usedPrefix, command) => {
    try {
      const sender = m.sender;

      let user = m.mentionedJid?.[0] 
        || m.quoted?.sender 
        || (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);

      if (!user) {
        return m.reply(`🚩 *Menciona o responde al usuario*\nEjemplo: ${usedPrefix + command} @user`);
      }

      // asegurar usuario en db
      const db = global.db.data;
      if (!db.users[user]) db.users[user] = {};

      // evitar mutear cosas importantes
      const owner = global.owner?.[0]?.[0] + '@s.whatsapp.net';

      if (user === owner) {
        return m.reply('🚩 *No puedes mutar al creador del bot*');
      }

      if (user === client.user.id.split(':')[0] + '@s.whatsapp.net') {
        return m.reply('🚩 *No puedes mutar al bot*');
      }

      // ======================
      // 🔇 MUTE
      // ======================
      if (command === 'mute') {

        if (db.users[user].muto) {
          return m.reply('🚩 *Este usuario ya está muteado*');
        }

        const thumb = await (await fetch('https://telegra.ph/file/f8324d9798fa2ed2317bc.png')).buffer();

        await client.sendMessage(m.chat, {
          text: '*🔇 Usuario muteado*\n> Sus mensajes serán eliminados',
          contextInfo: {
            mentionedJid: [user],
            externalAdReply: {
              title: 'Usuario muteado',
              body: 'Moderación activa',
              thumbnail: thumb,
              mediaType: 1,
              renderLargerThumbnail: true
            }
          }
        }, { quoted: m });

        db.users[user].muto = true;
      }

      // ======================
      // 🔊 UNMUTE
      // ======================
      if (command === 'unmute') {

        if (!db.users[user].muto) {
          return m.reply('🚩 *Este usuario no está muteado*');
        }

        if (user === sender) {
          return m.reply('🚩 *Otro admin debe desmutarte*');
        }

        const thumb = await (await fetch('https://telegra.ph/file/aea704d0b242b8c41bf15.png')).buffer();

        await client.sendMessage(m.chat, {
          text: '*🔊 Usuario desmuteado*\n> Ya puede enviar mensajes',
          contextInfo: {
            mentionedJid: [user],
            externalAdReply: {
              title: 'Usuario desmuteado',
              body: 'Moderación desactivada',
              thumbnail: thumb,
              mediaType: 1,
              renderLargerThumbnail: true
            }
          }
        }, { quoted: m });

        db.users[user].muto = false;
      }

    } catch (e) {
      console.error(e);
      m.reply('❌ Error en el comando');
    }
  }
};
