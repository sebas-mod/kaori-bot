export default {
  command: ['mute', 'unmute'],
  category: 'grupo',

  run: async (client, m, args, usedPrefix, command) => {
    try {
      let target = m.mentionedJid?.[0] || m.quoted?.sender;

      if (!target) return m.reply('🚩 Responde o menciona al usuario');

      const db = global.db.data;

      // 👇 MISMO FORMATO QUE sender
      target = target;

      const userData = db.users[target] ||= {};

      if (command === 'mute') {
        userData.muto = true;
        console.log('MUTEADO:', target);
        return m.reply('🔇 Usuario muteado');
      }

      if (command === 'unmute') {
        userData.muto = false;
        console.log('DESMUTEADO:', target);
        return m.reply('🔊 Usuario desmuteado');
      }

    } catch (e) {
      console.error(e);
      m.reply('❌ Error');
    }
  }
};
