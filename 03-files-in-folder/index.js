const fs = require('fs/promises');
const path = require('path');
const pathToSecretFolder = path.join(__dirname, 'secret-folder');

async function filesFromFolder(file) {
  const filePath = path.join(__dirname, 'secret-folder', file);
  const stat = await fs.stat(filePath);

  if (!stat.isDirectory()) {
    const fileExt = path.extname(file);
    const fileName = path.basename(file, fileExt);
    const fileSize = stat.size;
    let filesDescitpions = `${fileName} - ${fileExt.slice(1)} - ${fileSize}b\n`;
    process.stdout.write(filesDescitpions);
  }
}

async function Read() {
  let files = await fs.readdir(pathToSecretFolder);
  files.forEach(async (file) => {
    filesFromFolder(file);
  });
}
Read();
