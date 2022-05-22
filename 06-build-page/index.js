const fsPromises = require('fs/promises');
const path = require('path');
const fs = require('fs');

function getPath(filename) {
  switch (filename) {
  case 'components': return path.join(__dirname, 'components');
  case 'styles': return path.join(__dirname, 'styles');
  case 'style.css': return path.join(__dirname, 'project-dist', filename);
  case 'template': return path.join(__dirname, 'template.html');
  case 'dist': return path.join(__dirname, 'project-dist');
  case 'assets': return path.join(__dirname, 'assets');
  default: return path.join(__dirname, 'components', filename);
  }
}
function stylesDistInit() {
  fs.writeFile(getPath('style.css'), '', (err) => {
    if (err) throw err;
  });
}
const promiseMkdir = async (pathName) => {
  return await fsPromises.mkdir(pathName, { recursive: true });
};

const copyAssets = async (curPath, basePath) => {
  const files = await fsPromises.readdir(basePath, { withFileTypes: true });
  files.forEach(async dirent => {
    if (dirent.isDirectory()) {
      await promiseMkdir(path.join(curPath, dirent.name));
      copyAssets(path.join(curPath, dirent.name), path.join(basePath, dirent.name));
    } else if (dirent.isFile()) {
      fsPromises.copyFile(path.join(basePath, dirent.name), path.join(curPath, dirent.name), 2);
    }
  });

};
const getReadablePromise = async (stream) => {
  return await new Promise((resolve) => {
    stream.on('readable', async () => {
      let buffer = stream.read();
      if (buffer) {
        buffer = buffer.toString();
        resolve(buffer);
      }
    });
  });
};
const getTemplateData = async () => {
  const stream = fs.createReadStream(getPath('template'), 'utf-8');
  return await getReadablePromise(stream);
};
const getComponentsData = async () => {
  let componentsArr = [];
  const components = await fsPromises.readdir(getPath('components'), {
    withFileTypes: true,
  });
  for (let i = 0; i < components.length; i++) {
    if (components[i].isFile && components[i].name.split('.')[1] === 'html') {
      let fileObj = {};
      fileObj.fileName = components[i].name.split('.')[0];
      const pathComponent = getPath(components[i].name);
      const stream = fs.createReadStream(pathComponent, 'utf-8');
      let string = await getReadablePromise(stream);
      fileObj.fileData = string;
      componentsArr.push(fileObj);
    }
  }
  return await Promise.all(componentsArr);
};
const replaceTemplateToComponents = async (promiseDir) => {
  let templateData = await getTemplateData();
  const componentsData = await getComponentsData();
  for (let i = 0; i < componentsData.length; i++) {
    templateData = templateData.replace(`{{${componentsData[i].fileName}}}`, componentsData[i].fileData);
  }
  const distPath = path.join(promiseDir, 'index.html');
  let writeStream = fs.createWriteStream(distPath, { encoding: 'utf8' });
  writeStream.write(templateData);
};

const buildCssFiles = async () => {
  const files = await fsPromises.readdir(path.join(__dirname, 'styles'), { withFileTypes: true });
  files.forEach(dirent => {
    if (dirent.isFile() && dirent.name.split('.')[1] === 'css') {
      const direntPath = path.join(getPath('styles'), `${dirent.name}`);
      fs.readFile(direntPath, (err, data) => {
        if (err) return console.error(err.message);
        fs.appendFile(getPath('style.css'), data, err => {
          if (err) console.error(err.message);
        });
      });
    }
  });
};

const buildPage = async () => {
  await promiseMkdir(getPath('dist'));
  await replaceTemplateToComponents(getPath('dist'));
  await buildCssFiles();
  await promiseMkdir(path.join(getPath('dist'), 'assets'));
  await copyAssets(path.join(getPath('dist'), 'assets'), getPath('assets'));
  stylesDistInit();
};


buildPage();