const multer = require('multer');

const Mime_Types = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpeg',
  'image/png': 'png',
}

// SET STORAGE ENGINE
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './images/')
  },
  filename: (req, file, callback) => {
    const name = Date.now() + '--' + file.originalname.split(' ').join('_');
    const extension = Mime_Types[file.mimetype];
    callback(null, name + '.' + extension)
  }
});

module.exports = multer({ storage: fileStorageEngine }).single('image');