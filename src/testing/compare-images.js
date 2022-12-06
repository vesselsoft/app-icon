const Jimp = require('jimp');

//  Compare two images, returning the percentage of differing pixels.
module.exports = async function compareImages(lhs, rhs) {
  const l = await Jimp.read(lhs);
  const r = await Jimp.read(rhs);
  return Jimp.distance(l, r) * 100;
};
