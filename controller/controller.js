const db = require('../config/db');
const info = require('../models/UserInformation.js');
const path = require('path');
const multer = require('multer');

// Configure multer storage to retain original file name
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath = path.join(__dirname, '../uploads');
        
        if (file.fieldname === 'album') {
            uploadPath = path.join(__dirname, '../uploads/album');
        }
        
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Retain original file name
    }
});

const upload = multer({ storage: storage });

const m = {
    main: (req, res) => {
        res.render('logres');
    },

    login: (req, res) => {
        const { email, password } = req.body;
    console.log("Session:", req.session);

    info.login(email, password, (err, user) => {
        if (err) throw err;
        if (user) {
            req.session.username = user.username;

            // Now retrieve songs before rendering the player page
            info.getAll((err, result) => {
                if (err) throw err;
                
                // Pass both username and songs to the player view
                res.render('player', { username: user.username, songs: result });  // Pass username here
            });

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

    musictify: (req, res) => {
        info.getAll((err, result) => {
            if (err) throw err;
    
            // Check if the username exists in the session
            const username = req.session.username || 'Guest'; // Fallback to 'Guest' if not logged in
    
            // Pass both songs and username to the template
            res.render('player', { songs: result, username: username });
        });
    },


    uploadSong: (req, res) => {
        // Use 'fields' to handle multiple files with different names
        upload.fields([
            { name: 'musicFile', maxCount: 1 },
            { name: 'album', maxCount: 1 }
        ])(req, res, function (err) {
            if (err) {
                console.error("Error uploading file:", err);
                return res.status(500).send("Error uploading file");
            }
    
            // Extract form data (title, artist) and uploaded file information
            const { title, artist } = req.body;
            const musicFilePath = path.join('/uploads', req.files['musicFile'][0].originalname); // Music file path
            const albumFilePath = path.join('/uploads/album', req.files['album'][0].originalname); // Album cover path
    
            // Insert song metadata into the database
            const query = "INSERT INTO songs (title, artist, file_path, album) VALUES (?, ?, ?, ?)";
            db.query(query, [title, artist, musicFilePath, albumFilePath], (err) => {
                if (err) {
                    console.error("Error saving song data to database:", err);
                    return res.status(500).send("Error saving song data");
                }
    
                // Redirect or respond after successful upload and database insert
                res.redirect('/musictify'); // Adjust as necessary
            });
        });
    },
    

    deleteSong: (req, res) => {
        const songID = req.params.song_id;

        info.deleteSong(songID, (err, result) => {
            if (err) throw err;
            res.redirect('/musictify');  // After deletion, redirect back to the admin page
        });
    }

};

module.exports = m;