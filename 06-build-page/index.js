const fs = require('fs').promises;
const path = require('path');

const projectDistDir = 'project-dist';

async function createProjectFolder() {
  try {
    await fs.access(projectDistDir);
  } catch (err) {
    if (err.code === 'ENOENT') {
      try {
        await fs.mkdir(projectDistDir);
      } catch (mkdirError) {
        throw mkdirError;
      }
    } else {
      throw err;
    }
  }
}

async function compileStyles(stylesDir) {
  const styles = [];

  try {
    const files = await fs.readdir(stylesDir);
    for (const file of files) {
      if (path.extname(file) === '.css') {
        const content = await fs.readFile(path.join(stylesDir, file), 'utf-8');
        styles.push(content);
      }
    }
    await fs.writeFile(path.join(projectDistDir, 'style.css'), styles.join('\n'));
  } catch (error) {
    throw error;
  }
}

async function replaceTemplateTags(templateContent, componentsDir) {
  const regex = /{{([^{}]+)}}/g;

  try {
    const matches = templateContent.match(regex);

    if (matches) {
      for (const match of matches) {
        const componentName = match.replace(/[{}]/g, '');
        const componentPath = path.join(__dirname, componentsDir, `${componentName}.html`);
        
        try {
          const componentContent = await fs.readFile(componentPath, 'utf-8');
          templateContent = templateContent.replace(match, componentContent);
        } catch (readFileError) {
          throw readFileError;
        }
      }
    }

    return templateContent;
  } catch (error) {
    throw error;
  }
}

async function copyDirRecursive(src, dest) {
  try {
    const srcStat = await fs.stat(src);
    if (!srcStat.isDirectory()) {
      throw new Error(`${src} is not a directory`);
    }

    await fs.mkdir(dest, { recursive: true });

    const files = await fs.readdir(src);
    for (const file of files) {
      const srcPath = path.join(src, file);
      const destPath = path.join(dest, file);

      const fileStat = await fs.stat(srcPath);

      if (fileStat.isDirectory()) {
        await copyDirRecursive(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }

  } catch (error) {
    throw error;
  }
}

async function copyAssets(assetsDir) {
  const distAssetsDir = path.join(projectDistDir, 'assets');

  try {
    await createProjectFolder();

    await copyDirRecursive(assetsDir, distAssetsDir);

  } catch (error) {
    throw error;
  }
}

async function buildProject() {
  try {
    await createProjectFolder();
    const templatePath = path.join(__dirname, 'template.html');
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    const modifiedContent = await replaceTemplateTags(templateContent, 'components');

    await fs.writeFile(path.join(projectDistDir, 'index.html'), modifiedContent);

    const stylesDir = path.join(__dirname, 'styles');
    await compileStyles(stylesDir);

    const assetsDir = path.join(__dirname, 'assets');
    await copyAssets(assetsDir);

    console.log('Build completed successfully.');
  } catch (error) {
    console.error('Error', error);
  }
}

// Run the build process
buildProject();
