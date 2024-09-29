const db = require('../config/db');
const info = require('../models/UserInformation.js');
const path = require('path');
const multer = require('multer');

// Configure multer storage to retain original file name
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../uploads'); // Change path as needed
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Retain original file name
    }
});


const upload = multer({ storage: storage });

const m = {
    login: (req, res) => {
        res.render('logres');
    },

    Musictify: (req, res) => {
        const { email, password } = req.body;
        console.log("Session:", req.session);

        info.Musictify(email, password, (err, user) => {
            if (err) throw err;
            if (user) {
                req.session.username = user.username;  
                res.render('player', { username: user.username });
            } else {
                res.send('Invalid email or password');
            }
        });
    },

    register: (req, res) => {
        const data = req.body;
        info.register(data, (err) => {
            if (err) throw err;
            res.redirect('/');
        });
    },

    home: (req, res) => {
        const username = req.session.username || 'Guest';

        // Fetch songs using the model
        info.fetchSongs((err, songs) => {
            if (err) {
                console.error("Error fetching songs:", err);
                return res.status(500).send("Server Error");
            }

            // Pass both 'username' and 'songs' to the player view// Debugging: Check if songs data is coming through
            res.render('player', { username, songs });
        });
    },


    uploadSong: (req, res) => {
        upload.single('musicFile')(req, res, function (err) {
            if (err) {
                console.error("Error uploading file:", err);
                return res.status(500).send("Error uploading file");
            }

            // Extract form data (title, artist) and uploaded file information
            const { title, artist } = req.body;
            const filePath = path.join('/uploads', req.file.originalname); // Relative file path to store in DB

            // Insert song metadata into the database
            const query = "INSERT INTO songs (title, artist, file_path) VALUES (?, ?, ?)";
            db.query(query, [title, artist, filePath], (err) => {
                if (err) {
                    console.error("Error saving song data to database:", err);
                    return res.status(500).send("Error saving song data");
                }

                // Redirect or respond after successful upload and database insert
                res.redirect('/home'); // Adjust as necessary
            });
        });
    },

};

module.exports = m;