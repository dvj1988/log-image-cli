#! /usr/bin/env node
const logImg = require("log-image");
const path = require("path");
const filePath = process.argv[2];
const widthParamIndex = process.argv.findIndex(arg => arg === "--width");
const widthPercentage =
  widthParamIndex !== -1 ? process.argv[widthParamIndex + 1] : 100;

console.log(logImg(path.resolve(filePath), widthPercentage));
