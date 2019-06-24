#!/usr/bin/env node
const cli = require('commander');
const installer = require('./installer');
const ROOT_DIR = __dirname;
const ALLOWED_DEPTH = 1;

cli
    .option('-r, --root <path>', 'root dir')
    .option('-d, --depth <amount>', 'allowed depth')
    .parse(process.argv)

installer.installAll(cli.root || ROOT_DIR, true, cli.depth || ALLOWED_DEPTH);

module.exports = {
    installAll: installer.installAll
}