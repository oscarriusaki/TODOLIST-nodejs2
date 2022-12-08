const multer = require('multer');
const path = require('path');
const {v4: uuidv4} = require('uuid');

const diskstorage = multer.diskStorage({
    destination: path.join(__dirname, '../images'),
    filename: (req, file, cb ) => {
        cb(null, uuidv4() + '-' + file.originalname)
    }
});
const fileUpload = multer({
    storage: diskstorage
}).single('image');

module.exports = {
    fileUpload,
}
