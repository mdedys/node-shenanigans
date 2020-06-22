const sharp = require("sharp")

async function resizeImage(image, size, output) {
  const [width, height] = size
  await sharp(image).resize(width, height).toFile(output)
}

module.exports.resizeImage = resizeImage
