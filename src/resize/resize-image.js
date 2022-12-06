const sharp = require('sharp');

function parseSize(size) {
  const [width, height] = size.split('x').map(Number);

  if (
    typeof width !== 'number'
    || typeof height !== 'number'
    || Number.isNaN(width)
    || Number.isNaN(height)
  ) {
    throw new Error(`failed to parse size target image size '${size}'`);
  }

  return { width, height };
}

//  Takes a source image, resizes to a target path.
module.exports = async function resizeImage(source, target, size) {
  const { width, height } = parseSize(size);
  const resized = await sharp(source).resize(width, height);
  return resized.toFile(target);
};
