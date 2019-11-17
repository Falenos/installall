#!/usr/bin/env node
const cli = require('commander');
const installer = require('./installer');
const ROOT_DIR = __dirname;
const ALLOWED_DEPTH = 1;

cli
    .option('-i, --install', 'cli install')
    .option('-r, --root <path>', 'root dir')
    .option('-d, --depth <depth>', 'allowed depth')
    .parse(process.argv);

if(cli.install) {
    // console.log('CLI RUN', cli.root, cli.depth);
    installer.installAll(cli.root || ROOT_DIR, true, parseInt(cli.depth, 10) || ALLOWED_DEPTH);
}

module.exports = (root, allowedDepth) => installer.installAll(root || ROOT_DIR, true, allowedDepth || ALLOWED_DEPTH);