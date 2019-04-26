const fs = require("fs");
const path = require("path");
const WaterMark = require("./watermark");

const folderRoot = "/Users/haipq/Desktop/untitled folder";

const progressDir = async folder => {
  // Check Folder
  if (!(await fs.existsSync(folder))) {
    console.log("Not found folder " + folder);
    return;
  }

  const readFolder = await fs.readdirSync(folder);

  for (const file of readFolder) {
    const filePath = folder + "/" + file;
    const fileStats = fs.lstatSync(filePath);
    if (fileStats.isDirectory()) {
      console.log("Dir " + file);
      progressDir(filePath);
    } else if (fileStats.isFile()) {
      console.log("File " + file);
      await WaterMark.watermart(filePath);
    }
  }
};
progressDir(folderRoot);
