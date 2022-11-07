const {readdir, readFile, writeFile} = require('fs/promises');
const {resolve: resolvePath, extname} = require('path');

async function doBundle() {
  const styles = 'styles';
  const newCss = 'project-dist';
  const bundleCss = 'bundle.css';

  const nameOfFiles = await readdir(resolvePath(__dirname, styles), {
    withFileTypes: true,
  });
  const cssFile = nameOfFiles
    .filter((nameOfFile) => nameOfFile.isFile())
    .filter(({name}) => extname(name) === '.css');
  const data = await Promise.all(
    cssFile.map(({name}) =>
      readFile(resolvePath(__dirname, styles, name), 'utf8'),
    ),
  );
  writeFile(resolvePath(__dirname, newCss, bundleCss), data.join('\n'));
}
doBundle();
