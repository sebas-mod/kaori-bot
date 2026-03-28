let partidas = global.partidas || (global.partidas = {})

export default {
  command: ['versus'],
  category: 'games',

  run: async (client, m, args, usedPrefix) => {

    if (!args[0]) {
      return m.reply(`❌ Debes ingresar los datos

📌 Uso:
${usedPrefix}versus tipo cupos hora titulo

📍 Ejemplo:
${usedPrefix}versus mixto 4 23:00 vs clan pro

🧩 Tipo: masc / fem / mixto
👥 Cupos: 4 / 6 / 12
⏰ Hora: formato 24h`)
    }

    let tipo = (args[0] || 'mixto').toLowerCase()
    let cupos = parseInt(args[1]) || 4
    let hora = args[2] || '19:00'
    let titulo = args.slice(3).join(' ') || 'VERSUS FREE FIRE'

    if (!['masc', 'fem', 'mixto'].includes(tipo)) {
      return m.reply('❌ Tipo inválido')
    }

    if (![4, 6, 12].includes(cupos)) {
      return m.reply('❌ Solo 4, 6 o 12')
    }

    if (!hora.includes(':')) {
      return m.reply(`❌ Hora inválida\nEjemplo: ${usedPrefix}versus mixto 4 23:00 vs clan`)
    }

    let horarios = convertirHorarios(hora)

    let texto = generarLista(
      titulo,
      tipo,
      cupos,
      horarios,
      m.sender,
      [],
      []
    )

    let msg = await client.sendMessage(m.chat, { text: texto }, { quoted: m })

    partidas[msg.key.id] = {
      creador: m.sender,
      titulo,
      tipo,
      cupos,
      suplentes: 2,
      horario: horarios,
      jugadores: [],
      suplentesList: [],
      chat: m.chat
    }

    await client.sendMessage(m.chat, {
      react: { text: '🔥', key: msg.key }
    })
  }
}


// 🔥 HORARIOS
function convertirHorarios(horaArg) {
  let [h, m] = horaArg.split(':').map(Number)

  function fix(hora) {
    if (hora < 0) hora += 24
    if (hora >= 24) hora -= 24
    return `${hora.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
  }

  return {
    arg: fix(h),
    peru: fix(h - 2),
    colombia: fix(h - 2),
    mexico: fix(h - 3)
  }
}


// 🔥 LISTA
function generarLista(titulo, tipo, cupos, horarios, creador, jugadores, suplentes) {

  let listaJugadores = ''
  for (let i = 0; i < cupos; i++) {
    listaJugadores += `${i + 1}. ${jugadores[i] ? '@' + jugadores[i].split('@')[0] : ''}\n`
  }

  let listaSuplentes = ''
  for (let i = 0; i < 2; i++) {
    listaSuplentes += `${i + 1}. ${suplentes[i] ? '@' + suplentes[i].split('@')[0] : ''}\n`
  }

  return `╭━━〔 ${titulo.toUpperCase()} 〕━━╮
👑 Creador: @${creador.split('@')[0]}
🧩 Tipo: ${tipo.toUpperCase()}

👥 ${jugadores.length}/${cupos} jugadores
🔁 ${suplentes.length}/2 suplentes

⏰ HORARIOS:
🇦🇷 ${horarios.arg}
🇵🇪 ${horarios.peru}
🇨🇴 ${horarios.colombia}
🇲🇽 ${horarios.mexico}

━━━ JUGADORES ━━━
${listaJugadores}
━━━ SUPLENTES ━━━
${listaSuplentes}
╰━━━━━━━━━━━━╯

🔥 Reacciona para entrar/salir`
}


// 🔥 REACCIONES (TOGGLE REAL)
export async function before(m, { client }) {
  if (!m.message?.reactionMessage) return

  let reaction = m.message.reactionMessage
  let id = reaction.key.id
  let data = partidas[id]
  if (!data) return

  let user = m.sender

  let enJugadores = data.jugadores.includes(user)
  let enSuplentes = data.suplentesList.includes(user)

  // 🔁 TOGGLE
  if (enJugadores || enSuplentes) {

    // ❌ SALE
    if (enJugadores) {
      data.jugadores = data.jugadores.filter(u => u !== user)

      if (data.suplentesList.length > 0) {
        let sube = data.suplentesList.shift()
        data.jugadores.push(sube)
      }

    } else if (enSuplentes) {
      data.suplentesList = data.suplentesList.filter(u => u !== user)
    }

    await client.sendMessage(m.chat, {
      text: `❌ @${user.split('@')[0]} salió`,
      mentions: [user]
    })

  } else {

    // ✅ ENTRA
    if (data.jugadores.length < data.cupos) {
      data.jugadores.push(user)

    } else if (data.suplentesList.length < data.suplentes) {
      data.suplentesList.push(user)

    } else {
      return client.sendMessage(m.chat, {
        text: `❌ lista llena`
      })
    }

    await client.sendMessage(m.chat, {
      text: `✅ @${user.split('@')[0]} se unió`,
      mentions: [user]
    })
  }

  let texto = generarLista(
    data.titulo,
    data.tipo,
    data.cupos,
    data.horario,
    data.creador,
    data.jugadores,
    data.suplentesList
  )

  await client.sendMessage(data.chat, {
    text: texto,
    mentions: [...data.jugadores, ...data.suplentesList]
  })
}
