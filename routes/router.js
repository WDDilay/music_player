const express = require('express');
const router = express.Router();
const path = require('path');
const controller = require('../controller/controller.js');




router.get('/', controller.login);
router.post('/register', controller.register);
router.post('/uploadSong', controller.uploadSong);
router.get('/home', controller.home);

router.post('/Musictify', controller.Musictify);
router.use((req, res, next) => {
    console.log("Session middleware in router:", req.session); 
    next();
});

module.exports = router;
