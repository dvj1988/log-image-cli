#! /usr/bin/env node
const logImg = require("log-image");
const path = require("path");
const filePath = process.argv[2];
const isManPageRequested = process.argv.findIndex(arg => arg === "help");

if (isManPageRequested) {
  displayManPage();
} else {
  const widthParamIndex = process.argv.findIndex(arg => arg === "--width");
  const widthPercentage =
    widthParamIndex !== -1 ? process.argv[widthParamIndex + 1] : 100;

  console.log(logImg(path.resolve(filePath), widthPercentage));
}
function displayManPage() {
  console.log(
    `
Usage
  $ imgcli <filePath>

Options
  --width  specify width of the image to be rendered in percentage

Examples
  $ imgcli ./image.jpg --width 80
    `
  );
}
