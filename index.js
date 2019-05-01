const fs = require("fs");
const png = require("pngjs").PNG;
const jpeg = require("jpeg-js");
const mime = require("mime");
const colors = require("ansi-256-colors");
const MIME_PNG = "image/png";
const MIME_JPEG = "image/jpeg";

function getImageBufferData(path) {
  if ("string" !== typeof path) throw new Error("path must be a string");
  const mimeType = mime.getType(path);
  switch (mimeType) {
    case MIME_PNG: {
      const imageFile = fs.readFileSync(path);
      const { width, height, data } = png.sync.read(imageFile);
      return {
        width,
        height,
        data
      };
    }
    case MIME_JPEG: {
      const imageFile = fs.readFileSync(path);
      const { width, height, data } = jpeg.decode(imageFile);
      return {
        width,
        height,
        data
      };
    }
    default:
      throw new Error("MIME type not supported: " + mime);
  }
}

function renderImage(path) {
  const { data, width, height } = getImageBufferData(path);
  for (let i = 0; i < height; i++) {
    let rowColors = [];
    let row = data.slice(i * width * 4, i * width * 4 + width * 4);
    for (let j = 0; j < width * 4; j = j + 4) {
      rowColors.push([row[j], row[j + 1], row[j + 2], row[j + 3]]);
    }
    console.log(
      eval(
        rowColors
          .map(p => {
            return `colors.fg.getRgb(${Math.ceil((p[0] * 5) / 255)},${Math.ceil(
              (p[1] * 5) / 255
            )},${Math.ceil((p[2] * 5) / 255)})+ "■" + colors.reset`;
          })
          .join(" + ")
      )
    );
  }
}

renderImage("./card.png");
