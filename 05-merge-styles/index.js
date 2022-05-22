const fsPromises = require('fs/promises');
const path = require('path');
const fs = require('fs');
const pathBundle = path.join(__dirname, 'project-dist', 'bundle.css');
const pathName = path.join(__dirname, 'styles');

function bundleInit() {
  fs.readFile(pathBundle, (err) => {
    if (err) {
      fs.writeFile(pathBundle, '', (err) => {
        if (err) throw err;
      });
    }
  }
  );
}
const getArrayFiles = async () => {
  const files = await fsPromises.readdir(pathName, { withFileTypes: true });
  return files;
};
const copyFiles = async () => {
  const files = await getArrayFiles();
  files.forEach(dirent => {
    if(dirent.isFile() && dirent.name.split('.')[1] === 'css'){
      const direntPath = path.join(__dirname, 'styles', `${dirent.name}`);
      fs.readFile(direntPath, (err, data) => {
        if (err) return console.error(err.message);
        fs.appendFile(pathBundle, data, err => {
          if (err) console.log(err);
        });
      });
    }
  });
};

bundleInit();
copyFiles();