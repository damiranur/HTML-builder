const fs = require('fs');
const path = require('path');
const fsPromises = require('fs/promises');
const componentsPath = path.join(__dirname, 'components');
const stylesPath = path.join(__dirname, 'styles');
const assetsPath = path.join(__dirname, 'assets');
const tempHtmlPath = path.join(__dirname, 'template.html');
const cssBundlePath = path.join(__dirname, 'project-dist', 'style.css');
const assetsBundlePath = path.join(__dirname, 'project-dist', 'assets');
const htmlBundlePath = path.join(__dirname, 'project-dist', 'index.html');

async function clearFolder(bundlePath) {
  const file = await fsPromises.readdir(bundlePath);
  for (const el of file) {
    const base = path.join(bundlePath, file);
    const stat = await fsPromises.stat(base);
    if (stat.isDirectory()) {
      await clearFolder(base);
    } else {
      await fsPromises.rm(base);
    }
  }
}

function recursiveMerge(files = [], fileWrite) {
  if (!files.length) {
    return fileWrite.end();
  }

  const thisFile = path.resolve(stylesPath, files.pop());
  const thisReadStream = fs.createReadStream(thisFile, 'utf-8');
  thisReadStream.pipe(fileWrite, {end: false});
  thisReadStream.on('end', function () {
    fileWrite.write('\n\n');
    recursiveMerge(files, fileWrite);
  });
  thisReadStream.on('error', function (error) {
    console.log(error);
    fileWrite.close();
  });
}

async function buildCss() {
  const allfiles = await fsPromises.readdir(stylesPath);
  const cssFile = allfiles.filter((file) => path.extname(file) === '.css');
  const writeStr = fs.createWriteStream(cssBundlePath, 'utf-8');

  recursiveMerge(cssFile, writeStr);
}

async function buildHtml() {
  const allFile = await fsPromises.readdir(componentsPath);
  const files = allFile.filter((file) => path.extname(file) === '.html');
  const readd = fs.createReadStream(tempHtmlPath, 'utf-8');
  readd.on('data', async (htmlTemplate) => {
    let bundleHtml = htmlTemplate.toString();
    for (const name of files) {
      const compP = path.join(componentsPath, name);
      const comp = await fsPromises.readFile(compP);
      const firstName = path.basename(name, '.html');
      bundleHtml = bundleHtml.replace(`{{${firstName}}}`, comp);
    }
    await fsPromises.writeFile(htmlBundlePath, bundleHtml, 'utf-8');
  });
}

async function buildFolder() {
  const newFolder = path.join(__dirname, 'project-dist');
  await fsPromises.mkdir(newFolder, {recursive: true});
}

async function copuAssest(bundleFolder, sourceFolder) {
  await fsPromises.mkdir(bundleFolder, {recursive: true});
  const files = await fsPromises.readdir(sourceFolder);

  files.forEach(async (file) => {
    const basef = path.join(sourceFolder, file);
    const newf = path.join(bundleFolder, file);
    const stat = await fsPromises.stat(basef);
    if (stat.isDirectory()) {
      copuAssest(newf, basef);
    } else {
      await fsPromises.copyFile(basef, newf);
    }
  });
}

async function pageBuild() {
  await buildFolder();
  await clearFolder(path.join(__dirname, 'project-dist'));
  buildHtml();
  buildCss();

  copuAssest(assetsBundlePath, assetsPath);
}

pageBuild();
