const Jimp = require("jimp");
const fs = require("fs");
const path = require("path");
const maxWidthHeight = 1024;
const repeatSpacingLogo = 170; // px
const opacityLogo = 0.19;

const watermart = async imageFile => {
  // Check File
  if (!(await fs.existsSync(imageFile))) {
    return;
  }

  const filePath = path.parse(imageFile);
  const fileDir = filePath.dir;
  const fileName = path.basename(imageFile);
  const fileWaterMarked = fileDir + "/wm/" + fileName;
  // console.log("File " + fileName + " -> " + filePath.ext);
  // Check Images supported
  if (
    filePath.ext !== ".jpg" &&
    filePath.ext !== ".JPG" &&
    filePath.ext !== ".png" &&
    filePath.ext !== ".PNG" &&
    filePath.ext !== ".jpeg" &&
    filePath.ext !== ".JPEG" &&
    filePath.ext !== ".webp"
  ) {
    console.log("File " + fileName + " not support!");
    return;
  }

  // Check WaterMarked
  if (await fs.existsSync(fileWaterMarked)) {
    console.log("File " + fileName + " has watermarked!");
    return;
  }

  // console.log("File " + fileName + " doing add watermark!");

  // load Logo
  const logo = await Jimp.read(__dirname + "/logo.png");
  logo.quality(100);
  // load image
  const image = await Jimp.read(imageFile);
  image.quality(100);
  let imageWidth = image.bitmap.width;
  let imageHeight = image.bitmap.height;
  // console.log(
  //   "Original Image Width: " + imageWidth + " Height: " + imageHeight
  // );
  if (imageWidth > maxWidthHeight || imageHeight > maxWidthHeight) {
    if (imageWidth >= imageHeight) {
      image.resize(maxWidthHeight, Jimp.AUTO);
    } else {
      image.resize(Jimp.AUTO, maxWidthHeight);
    }
    imageWidth = image.bitmap.width;
    imageHeight = image.bitmap.height;
    // console.log(
    //   "Resize Image Width: " + imageWidth + " Height: " + imageHeight
    // );
  }

  const logoSize = (imageWidth / repeatSpacingLogo) * 12;

  logo.resize(logoSize, Jimp.AUTO);

  const logoWidth = logo.bitmap.width;
  const logoHeight = logo.bitmap.height;

  const row = imageWidth / repeatSpacingLogo;
  const col = imageHeight / repeatSpacingLogo;

  let r;
  let c;
  for (r = 1; r <= row; r++) {
    for (c = 1; c <= col; c++) {
      const paddingLeft = c % 2 === 0 ? repeatSpacingLogo / 2 : 0;
      const px = r * repeatSpacingLogo - paddingLeft - logoWidth / 2;
      const py = c * repeatSpacingLogo - logoHeight / 2;
      if (px >= imageWidth - repeatSpacingLogo / 2) {
        continue;
      }
      if (py >= imageHeight - repeatSpacingLogo / 2) {
        continue;
      }
      await image.composite(logo, px, py, {
        mode: Jimp.BLEND_SOURCE_OVER,
        opacitySource: opacityLogo,
        opacityDest: 1
      });
    }
  }

  await image.writeAsync(fileWaterMarked);
  console.log("File " + fileName + " created watermark!");
};
module.exports.watermart = watermart;
// watermart("./imagetest.jpg");
