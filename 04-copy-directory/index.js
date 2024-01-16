const fs = require('fs').promises;
const path = require('path');

const existingFolder = path.join(__dirname, 'files');
const newFolder = path.join(__dirname, 'files-copy');

function copyDir(src, dest) {
  return fs.readdir(src)
    .then(files => Promise.all(files.map(file => {
      const srcPath = path.join(src, file);
      const destPath = path.join(dest, file);

      return fs.stat(srcPath)
        .then(stat => stat.isDirectory() ? copyDir(srcPath, destPath) : fs.copyFile(srcPath, destPath));
    })));
}

Promise.all([
  fs.mkdir(newFolder, { recursive: true }),
  fs.readdir(existingFolder),
  fs.readdir(newFolder)
])
  .then(([_, existingFiles, copiedFiles]) => {
    const deletePromises = copiedFiles
      .filter(file => !existingFiles.includes(file))
      .map(file => fs.unlink(path.join(newFolder, file)));

    return Promise.all(deletePromises);
  })
  .then(() => copyDir(existingFolder, newFolder))
  .then(() => console.log('Directory copied successfully.'))
  .catch(err => console.error('Error', err));
