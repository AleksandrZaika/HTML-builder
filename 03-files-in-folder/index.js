const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error("Error", err);
    return;
  }

  files.forEach((file) => {
    const filePath = path.join(folderPath, file.name);

    if (file.isFile()) {
      fs.stat(filePath, (statErr, stats) => {
        if (statErr) {
          console.error('Error', statErr);
          return;
        }

        const fileSize = (stats.size / 1024).toFixed(3);
        const fileExt = path.extname(file.name).slice(1);
        const fileName = path.basename(file.name, `.${fileExt}`);

        console.log(`${fileName} - ${fileExt} - ${fileSize}kb`);
      });
    }
  });
});
