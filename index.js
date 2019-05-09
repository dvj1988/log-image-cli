#! /usr/bin/env node
const logImg = require("log-image");
const path = require("path");
const filePath = process.argv[2];

console.log(logImg(path.resolve(filePath)));
