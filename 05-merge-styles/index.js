const fs = require('fs').promises;
const path = require('path');

const stylesFolder = path.join(__dirname, 'styles');
const projectFolder = path.join(__dirname, 'project-dist');
const outputFile = path.join(projectFolder, 'bundle.css');

fs.readdir(stylesFolder)
  .then(files => {
    const cssFiles = files.filter(file => path.extname(file) === '.css');
    const readFilePromises = cssFiles.map(cssFile => {
      const filePath = path.join(stylesFolder, cssFile);
      return fs.readFile(filePath, 'utf8');
    });

    return Promise.all(readFilePromises);
  })
  .then(fileContents => {
    const bundledStyles = fileContents.join('\n');
    return fs.writeFile(outputFile, bundledStyles);
  })
  .then(() => {
    console.log('Bundle created.');
  })
  .catch(err => {
    console.error('Error', err);
  });
