export default {
  name: 'anti-mute-system',

  all: async function (m, { client }) {
    try {
      if (!m.isGroup) return;

      const sender = m.sender;
      const user = global.db.data.users[sender];

      if (user?.muto) {
        console.log('MUTE DETECTADO:', sender);

        await client.sendMessage(m.chat, {
          delete: m.key
        });

      }

    } catch (e) {
      console.log('ERROR ANTI-MUTE:', e);
    }
  }
};
