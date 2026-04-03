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

      // 🔥 asegurar usuario en la DB (igual que tu handler)
      let user = global.db.data.users[target];
      if (!user) {
        global.db.data.users[target] = {};
        user = global.db.data.users[target];
      }

      // ======================
      // 🔇 MUTE
      // ======================
      if (command === 'mute') {

        if (user.muto === true) {
          return m.reply('🚩 *Este usuario ya está muteado*');
        }

        user.muto = true;

        console.log('MUTEADO:', target);

        return m.reply('🔇 Usuario muteado correctamente');
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

        console.log('DESMUTEADO:', target);

        return m.reply('🔊 Usuario desmuteado correctamente');
      }

    } catch (e) {
      console.error(e);
      m.reply('❌ Error en el comando');
    }
  }
};
