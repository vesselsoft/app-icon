const sharp = require('sharp');
const getImageWidth = require('../imagemagick/get-image-width');

/**
 * caption - add a caption to an image.
 *
 * @param input - the path to the input image.
 * @param output - the path to the output image.
 * @param label - the label or caption to add.
 * @param gravity - the position - any imagemagick 'gravity' value. Normally
 * 'north', 'south' or 'center'.
 * @param proportionalSize - the size of the total image which should be taken
 * up by the caption. e.g. 0.2 means 20% of the icon will have the caption.
 * @returns a promise which resolves with the result of the CLI command.
 */
async function caption(input, output, properties) {
  //  Get the image width.
  const width = await getImageWidth(input);

  const labels = [];

  await properties.reduce(async (prev, [label, gravity, proportionalSize]) => {
    await prev;
    if (!label) return Promise.resolve();

    //  The height is a proportional amount of the of the width. This means
    //  with a square image, a proportionalSize of 0.2 and a gravity of 'bottom',
    //  the bottom 20% of the icon will contain the caption.
    const height = Math.round(width * proportionalSize);

    const iconLabel = await sharp({
      create: {
        background: {
          alpha: 0,
          b: 0,
          g: 0,
          r: 0,
        },
        channels: 4,
        width,
        height,
      },
    })
      .composite([
        {
          gravity: 'center',
          input: {
            create: {
              background: {
                alpha: 0.5,
                b: 0,
                g: 0,
                r: 0,
              },
              width,
              height,
              channels: 4,
            },
          },
        },
        {
          gravity: 'center',
          input: {
            text: {
              text: `<span color="white">${label}</span>`,
              height: 0.6 * height,
              width: 0.9 * width,
              rgba: true,
            },
          },
        },
      ])
      .png()
      .toBuffer();
    labels.push({ input: iconLabel, gravity });

    return Promise.resolve();
  }, Promise.resolve());

  return sharp(input).composite(labels).png().toFile(output);
}

//  Single function to label an image (optionally top and bottom).
module.exports = async function labelImage(input, output, top, bottom, middle) {
  //  We'll have a set of promises which we will run, which will update the image.
  await caption(input, output, [
    [top, 'north', 0.2],
    [middle, 'center', 0.6],
    [bottom, 'south', 0.2],
  ]);
};
