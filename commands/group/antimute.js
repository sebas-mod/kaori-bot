export default {
  name: 'anti-mute',

  all: async function (m, { client }) {
    try {
      if (!m.isGroup) return;

      let user = global.db.data.users[m.sender];

      if (user?.muto) {
        await client.sendMessage(m.chat, {
          delete: {
            remoteJid: m.chat,
            fromMe: false,
            id: m.key.id,
            participant: m.key.participant || m.sender
          }
        });
      }

    } catch (e) {
      console.log('ANTI-MUTE ERROR:', e);
    }
  }
};
