#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const WaterMark = require("./watermark");
const [, , ...args] = process.argv;

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
    if (fileStats.isDirectory() && file !== "wm") {
      // console.log("Dir " + file);
      await progressDir(filePath);
    } else if (fileStats.isFile()) {
      // console.log("File " + file);
      await WaterMark.watermart(filePath);
    }
  }
};

const cli = async args => {
  if (args && args.length > 0) {
    const folderRoot = args[0];
    console.log(" Deji WaterMark v1.0  ");
    console.log(" --- Start ---  ");
    await progressDir(folderRoot);
    console.log(" --- Done ---  ");
  } else {
    console.log(" Deji WaterMark v1.0 ");
  }
};

cli(args);
