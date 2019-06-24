#!/usr/bin/env node
const installer = require('./installer');
const ROOT_DIR = __dirname;
const ALLOWED_DEPTH = 1;

installer.installAll(ROOT_DIR, true, ALLOWED_DEPTH);