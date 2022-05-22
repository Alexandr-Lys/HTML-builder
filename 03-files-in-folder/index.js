const fsPromises = require('fs/promises');
const path = require('path');
const fs = require('fs');
const process = require('process');
//const readline = require('readline');

const pathName = path.join(__dirname, 'secret-folder');
function getPathFile(fileName){
  return path.join(__dirname, 'secret-folder', `${fileName}`);
}

const getArrayFiles = async() => {
  const files = await fsPromises.readdir(pathName, { withFileTypes: true });
  return files;
};

const writeFiles = async() => {
  const filesArray = await getArrayFiles();
  filesArray.forEach(dirent => {
    if(dirent.isFile()) {
      fs.stat(getPathFile(dirent.name), (err, stats) => {
        process.stdout.write(`${dirent.name.split('.')[0]} - ${dirent.name.split('.')[1]} - ${stats.size}b\n`);
      });
    }
  });
};

writeFiles();