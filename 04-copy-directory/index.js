const fsPromises = require('fs/promises');
const path = require('path');
const fs = require('fs');
const pathCopy = path.join(__dirname, 'files-copy');
const pathName = path.join(__dirname, 'files');

const getArrayFiles = async () => {
  const files = await fsPromises.readdir(pathName, { withFileTypes: true });
  return files;
};

const promiseMkdir = async () => {
  await fsPromises.mkdir(pathCopy, { recursive: true });
};

const copyFiles = async () => {
  await fsPromises.rm(pathCopy, {
    recursive: true,
    force: true,
  });
  await promiseMkdir();
  const files = await getArrayFiles();
  files.forEach(dirent => {
    const pathNameFiles = path.join(__dirname, 'files', `${dirent.name}`);
    const pathCopyFiles = path.join(__dirname, 'files-copy', `${dirent.name}`);
    fs.copyFile(pathNameFiles, pathCopyFiles, err => {
      if (err) console.log(err);
    });
  });
};
copyFiles();
