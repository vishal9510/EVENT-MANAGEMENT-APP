const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/events');  // Folder where images will be stored
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.upload}`);
    }
});

// Check file type (only images allowed)
const fileFilter = (req, file, cb) => {
    const allowedTypes = "/jpeg|jpg|png/";
    const extname = allowedTypes.test(path.extname(file.upload).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Images only!'), false);
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },  // 5MB limit
    fileFilter
});

module.exports = upload;
