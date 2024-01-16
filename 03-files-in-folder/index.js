const fs = require('fs');
const path = require('path');
const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error("Error", err);
    return;
  }

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);

    fs.stat(filePath, (statErr, stats) => {
      if (statErr) {
        console.error('Error', statErr);
        return;
      }

      const fileSize = (stats.size / 1024).toFixed(3);
      const fileExt = path.extname(file).slice(1);
      const fileName = path.basename(file, `.${fileExt}`);

      console.log(`${fileName} - ${fileExt} - ${fileSize}kb`);
    });
  });
});