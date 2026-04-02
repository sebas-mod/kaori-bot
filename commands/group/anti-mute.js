export default {
  name: 'anti-mute',

  before: async function (m, { client }) {
    try {
      if (!m.isGroup) return;

      const sender = m.sender;
      const user = global.db.data.users[sender];

      if (user?.muto) {
        console.log('MUTE DETECTADO:', sender);

        await client.sendMessage(m.chat, {
          delete: {
            remoteJid: m.chat,
            fromMe: false,
            id: m.key.id,
            participant: sender
          }
        });

        return true; // 🔴 corta ejecución de comandos
      }

    } catch (e) {
      console.log('ERROR ANTI-MUTE:', e);
    }
  }
};
