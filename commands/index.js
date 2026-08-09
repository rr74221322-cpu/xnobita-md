// ───────── X NOBITA MD COMMAND LOADER ─────────
const core = require('./core')
const fun = require('./fun')
const ai = require('./ai')
const downloader = require('./downloader')
const sticker = require('./sticker')
const group = require('./group')
const search = require('./search')
const tools = require('./tools')

global.ALL_COMMANDS = {
    ...core,
    ...fun,
    ...ai,
    ...downloader,
    ...sticker,
    ...group,
    ...search,
    ...tools
}

module.exports = {
    commands: global.ALL_COMMANDS,
    protectionHook: group.protectionHook,
    welcomeHook: group.welcomeHook
}
