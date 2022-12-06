const sharp = require('sharp');
const getImageWidth = require('../imagemagick/get-image-width');

/**
 * init - creates an icon from a template.
 *
 * @param template
 * @param output
 * @param options
 * @returns a promise which resolves when the icon has been created.
 */
async function init(template, output, options) {
  //  If there is no caption, then we can just copy the image.
  const caption = (options && options.caption) || '';

  //  We have a caption, so we'll need to get the image width to work out how
  //  to arrange it on the icon.
  const width = await getImageWidth(template);

  //  Create the command to generate the image.
  // const command = `convert \
  //       -background "rgba(0,0,0,0)" -fill white \
  //       -gravity center -size ${w}x${h} \
  //       -stroke black -strokewidth 2 caption:"${caption}" \
  //       ${template} +swap -composite ${output}`;
  // return imagemagickCli.exec(command);
  const composites = [
    {
      input: template,
      gravity: 'center',
    },
  ];

  if (caption) {
    // add caption
    composites.push({
      input: {
        text: {
          text: `<span foreground="white">${caption}</span>`,
          width: width * 0.8,
          height: width,
          rgba: true,
        },
      },
      gravity: 'center',
    });
  }

  await sharp({
    create: {
      background: {
        alpha: 0,
        b: 0,
        g: 0,
        r: 0,
      },
      height: width,
      width,
      channels: 4,
    },
  })
    .composite(composites)
    .toFile(output);

  return Promise.resolve();
}

module.exports = init;
