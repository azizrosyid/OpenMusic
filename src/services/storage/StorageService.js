const fs = require('fs');

class StorageService {
  constructor(storagePath) {
    this.storagePath = storagePath;

    if (!fs.existsSync(this.storagePath)) {
      fs.mkdirSync(this.storagePath, { recursive: true });
    }
  }

  writeFile(data, metaFileName) {
    const fileName = `${Date.now()}-${metaFileName}`;
    const filePath = `${this.storagePath}/${fileName}`;

    // create stream file
    const fileStream = fs.createWriteStream(filePath);

    // write data to file

    return new Promise((resolve, reject) => {
      fileStream.on('error', (err) => reject(err));
      data.pipe(fileStream);
      fileStream.on('finish', () => resolve(fileName));
    });
  }
}
module.exports = StorageService;
