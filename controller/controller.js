const db = require('../config/db');
const info = require('../models/UserInformation.js');
const path = require('path');
const musicMetadata = require('music-metadata');
const multer = require('multer');

// Configure multer storage to retain original file name
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
        
        // Query the database for all songs
        db.query('SELECT * FROM songs', (err, songs) => {
            if (err) {
                console.error("Error fetching songs:", err);
                return res.status(500).send("Server Error");
            }
            // Pass both username and songs to the view
            res.render('player', { username, songs });
        });
    },

    uploadSong: async (req, res) => {
        try {
            if (!req.file) {
                console.log('No file received.');
                return res.status(400).send('No file uploaded.');
            }
    
            const { title, artist } = req.body;
            const filePath = req.file.filename; // Use filename, not full path
    
            // Save song details to the database (title, artist, file_path)
            const songData = { title, artist, file_path: filePath };
            db.query('INSERT INTO songs SET ?', songData, (err, result) => {
                if (err) {
                    console.error('Error inserting song:', err);
                    return res.status(500).send('Error saving song.');
                }
                console.log('Song saved successfully:', result);
                res.redirect('/home');
            });
        } catch (error) {
            console.error('Error uploading song:', error);
            return res.status(500).send('Error processing upload.');
        }
    },

    addSong: (title, artist, filePath, duration, callback) => {
        const sql = "INSERT INTO songs (title, artist, file_path) VALUES (?, ?, ?, ?)";
        db.query(sql, [title, artist, filePath], callback);
    },

    getMusicList: (req, res) => {
        info.getAllSongs((err, songs) => {
            if (err) {
                console.error('Error fetching songs:', err);
                return res.status(500).send('Error fetching songs');
            }
            const username = req.session.username || 'Guest';
            res.render('player', { username, songs });
        });
    }
};

module.exports = m;