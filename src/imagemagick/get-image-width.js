const sharp = require('sharp');

module.exports = async function getImageWidth(path) {
  const metadata = await sharp(path).metadata();

  if (Number.isNaN(metadata.width)) {
    throw new Error(`Cannot parse returned width '${path}'`);
  }

  return metadata.width;
};
