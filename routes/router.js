const express = require('express');
const router = express.Router();
const controller = require('../controller/controller.js');




router.get('/', controller.main);
router.post('/register', controller.register);
router.post('/uploadSong', controller.uploadSong);
router.get('/Musictify', controller.musictify);
router.post('/deleteSong/:song_id', controller.deleteSong);

router.post('/login', controller.login);
router.use((req, res, next) => {
    console.log("Session middleware in router:", req.session); 
    next();
});

module.exports = router;
