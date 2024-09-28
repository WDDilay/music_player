const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const controller = require('../controller/controller.js');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Use an absolute path to ensure files are stored in the correct location
        const uploadPath = path.join(__dirname, '../uploads');
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });

const fs = require('fs');


const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

router.post('/Musictify', controller.Musictify); 
router.get('/home', controller.home);

router.get('/home', controller.getMusicList); 
router.post('/uploadSong', upload.single('musicFile'), controller.uploadSong);


router.get('/', controller.login);
router.post('/register', controller.register);

router.use((req, res, next) => {
    console.log("Session middleware in router:", req.session); 
    next();
});

module.exports = router;
