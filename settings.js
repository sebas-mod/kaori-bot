import fs from 'fs';
import { watchFile, unwatchFile } from 'fs'
import { fileURLToPath } from 'url'

global.owner = ['5491138403093']
global.botNumber = ''

global.sessionName = 'Sessions/Owner'
global.version = '^1.0 - Latest'
global.dev = "© p̶o̶w̶e̶r̶e̶d̶ ̶b̶y̶ ̶:̶ ̶s̶e̶b̶a̶s̶ ̶m̶d̶"
global.links = {
api: 'https://api.stellarwa.xyz',
channel: "",
github: "",
gmail: ""
}
global.my = {
ch: '',
name: 'K̴A̴O̴R̴I̴ ̴B̴O̴T̴',
}

global.mess = {
socket: '《✧》 Este comando solo puede ser ejecutado por un Socket.',
admin: '《✧》 Este comando solo puede ser ejecutado por los Administradores del Grupo.',
botAdmin: '《✧》 Este comando solo puede ser ejecutado si el Socket es Administrador del Grupo.'
}

global.APIs = {
axi: { url: "https://apiaxi.i11.eu", key: null },
vreden: { url: "https://api.vreden.web.id", key: null },
nekolabs: { url: "https://api.nekolabs.web.id", key: null },
siputzx: { url: "https://api.siputzx.my.id", key: null },
delirius: { url: "https://api.delirius.store", key: null },
ootaizumi: { url: "https://api.ootaizumi.web.id", key: null },
stellar: { url: "https://api.stellarwa.xyz", key: "YukiWaBot" },
apifaa: { url: "https://api-faa.my.id", key: null },
xyro: { url: "https://api.xyro.site", key: null },
yupra: { url: "https://api.yupra.my.id", key: null }
}

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  import(`${file}?update=${Date.now()}`)
})
