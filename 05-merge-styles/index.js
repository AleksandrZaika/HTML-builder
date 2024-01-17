const fs = require('fs');
const path = require('path');

const stylesFolder = path.join(__dirname, 'styles');
const projectFolder = path.join(__dirname, 'project-dist');
const outputFile = path.join(projectFolder, 'bundle.css');

fs.readdir(stylesFolder, (err, files) => {
  if (err) {
    console.error('Error', err);
    return;
  }
  const cssFiles = files.filter(file => path.extname(file) === '.css');
  const stylesArray = [];
  cssFiles.forEach(cssFile => {
    const filePath = path.join(stylesFolder, cssFile);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    stylesArray.push(fileContent);
  });

  const bundledStyles = stylesArray.join('\n');

  fs.writeFileSync(outputFile, bundledStyles);

});
