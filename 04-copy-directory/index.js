const path = require('path');
const fsPromises = require('fs').promises;

let folder = path.join(__dirname, 'files');
let copyFolder = path.join(__dirname, 'files-copy');

async function copyDir(src, dest) {
  await fsPromises.mkdir(dest, {recursive: true});
  const files = await fsPromises.readdir(src, {withFileTypes: true});

  for (let f of files) {
    let folderPath = path.join(src, f.name);
    let copyFolderPath = path.join(dest, f.name);

    if (f.isDirectory()) {
      await copyDir(folderPath, copyFolderPath);
    } else {
      await fsPromises.copyFile(folderPath, copyFolderPath);
    }
  }
}
copyDir(folder, copyFolder);
