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
  const {
    data: resizedImage,
    width: newWidth,
    height: newHeight
  } = resizeImageWithNewWidth(data, width, height, 100);
  for (let i = 0; i < newHeight; i++) {
    let rowColors = [];
    let row = data.slice(i * newWidth * 4, i * newWidth * 4 + newWidth * 4);
    for (let j = 0; j < newWidth * 4; j = j + 4) {
      rowColors.push([row[j], row[j + 1], row[j + 2], row[j + 3]]);
    }
    console.log(
      eval(
        rowColors
          .map(p => {
            return `colors.fg.getRgb(${Math.ceil((p[0] * 5) / 255)},${Math.ceil(
              (p[1] * 5) / 255
            )},${Math.ceil((p[2] * 5) / 255)})+ "██" + colors.reset`;
          })
          .join(" + ")
      )
    );
  }
}

renderImage("./card.png");

function resizeImageWithNewWidth(
  imageData,
  actualWidth,
  actualHeight,
  targetWidth
) {
  const resizeFactor = Math.ceil(actualWidth / targetWidth);

  if (resizeFactor > 1) {
    let y = 0;
    let resizedImageData = [];
    while (y < actualHeight / resizeFactor) {
      // Iterate through each row of the canvas. Incremented in units of tile height
      let x = 0;
      while (x < actualWidth / resizeFactor) {
        //Iterate through each column of a particular row. Incremented in units of tile width
        let i = 0;
        let red = 0;
        let green = 0;
        let blue = 0;
        while (i < resizeFactor) {
          let row = imageData.slice(
            i * actualWidth * 4 +
              x * resizeFactor * 4 +
              y * resizeFactor * actualWidth * 4,
            i * actualWidth * 4 +
              x * resizeFactor * 4 +
              y * resizeFactor * actualWidth * 4 +
              resizeFactor * 4
          );
          //Get average color of the 1px row of the tile
          row.forEach((color, index) => {
            switch (index % 4) {
              case 0:
                red += color;
                break;
              case 1:
                green += color;
                break;
              case 2:
                blue += color;
                break;
            }
          });
          i++; // Increment the row inside tile by 1px
        }
        //Computation of average color of single tile
        red = Math.floor(red / (resizeFactor * resizeFactor));
        green = Math.floor(green / (resizeFactor * resizeFactor));
        blue = Math.floor(blue / (resizeFactor * resizeFactor));

        resizedImageData.push(red);
        resizedImageData.push(green);
        resizedImageData.push(blue);
        x++;
      }
      y++;
    }
    return {
      data: resizedImageData,
      width: actualWidth / resizeFactor,
      height: (resizedImageData.length * resizeFactor) / actualWidth
    };
  }

  return { data: imageData, width: actualHeight, height: actualHeight };
}
// renderImage("./partly-cloudy.png");
