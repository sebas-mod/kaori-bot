import fetch from 'node-fetch';

export default {
  command: ['mute', 'unmute'],
  category: 'grupo',
  admin: true,
  botAdmin: true,

  run: async (client, m, args, usedPrefix, command) => {
    try {
      let target = m.mentionedJid?.[0] || m.quoted?.sender;

      if (!target) {
        return m.reply('🚩 *Responde o menciona al usuario*');
      }

      const user = global.db.data.users[target] ||= {};

      // ======================
      // 🔇 MUTE
      // ======================
      if (command === 'mute') {

        if (user.muto === true) {
          return m.reply('🚩 *Este usuario ya está muteado*');
        }

        user.muto = true;

        const thumb = await (await fetch('https://telegra.ph/file/f8324d9798fa2ed2317bc.png')).buffer();

        await client.sendMessage(m.chat, {
          text: '*🔇 Usuario muteado*\n> Sus mensajes serán eliminados',
          contextInfo: {
            mentionedJid: [target],
            externalAdReply: {
              title: '𝗨𝘀𝘂𝗮𝗿𝗶𝗼 𝗺𝘂𝘁𝗮𝗱𝗼',
              thumbnail: thumb,
              mediaType: 1,
              renderLargerThumbnail: true
            }
          }
        }, { quoted: m });
      }

      // ======================
      // 🔊 UNMUTE
      // ======================
      if (command === 'unmute') {

        if (user.muto === false) {
          return m.reply('🚩 *Este usuario no está muteado*');
        }

        if (target === m.sender) {
          return m.reply('🚩 *Otro admin debe desmutarte*');
        }

        user.muto = false;

        const thumb = await (await fetch('https://telegra.ph/file/aea704d0b242b8c41bf15.png')).buffer();

        await client.sendMessage(m.chat, {
          text: '*🔊 Usuario desmuteado*\n> Ya puede enviar mensajes',
          contextInfo: {
            mentionedJid: [target],
            externalAdReply: {
              title: '𝗨𝘀𝘂𝗮𝗿𝗶𝗼 𝗱𝗲𝗺𝘂𝘁𝗮𝗱𝗼',
              thumbnail: thumb,
              mediaType: 1,
              renderLargerThumbnail: true
            }
          }
        }, { quoted: m });
      }

    } catch (e) {
      console.error(e);
      m.reply('❌ Error en el comando');
    }
  }
};
