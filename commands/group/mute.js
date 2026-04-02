export default {
  command: ['mute', 'unmute'],
  category: 'grupo',
  isAdmin: true,
  botAdmin: true,

  run: async (client, m, args, usedPrefix, command) => {
    try {
      let target = m.mentionedJid?.[0] || m.quoted?.sender;

      if (!target) {
        return m.reply('🚩 *Responde o menciona al usuario*');
      }

      const db = global.db.data;

      // 🔴 MUY IMPORTANTE: misma estructura que tu bot
      const userData = db.users[target] ||= {};

      if (command === 'mute') {
        userData.muto = true;
        console.log('MUTEADO:', target); // debug
        return m.reply('🔇 Usuario muteado correctamente');
      }

      if (command === 'unmute') {
        userData.muto = false;
        console.log('DESMUTEADO:', target);
        return m.reply('🔊 Usuario desmuteado correctamente');
      }

    } catch (e) {
      console.error(e);
      m.reply('❌ Error');
    }
  }
};
