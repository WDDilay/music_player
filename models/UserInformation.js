const db = require('../config/db');
const info = {
    register:(data, callback) =>{
        const query ="insert into users (username, email, password) values(?,?,?)";
        db.query(query, [data.username, data.email, data.password], callback);
    },

    
    Musictify: (email, password, callback) => {
        const query = "SELECT * FROM users WHERE email = ?";
        db.query(query, [email], (err, results) => {
            if (err) return callback(err);

            if (results.length === 0) {
                // No user found with this email
                return callback(null, false);
            }

            const user = results[0];

            // Check if the password matches (this is a simple plain-text comparison, but you should hash passwords)
            if (user.password === password) {
                // Password matches, return user data
                return callback(null, user);
            } else {
                // Password doesn't match
                return callback(null, false);
            }
        });
    },

    fetchSongs: (callback) => {
        const query = "SELECT * FROM songs";
        db.query(query, (err, results) => {
            if (err) {
                console.error("Error fetching songs:", err);  // Log the error
                return callback(err);
            }
    
            // Check if there are any results and log them for debugging
            if (results.length === 0) {
                console.log("No songs found in the database.");
            } else {
                console.log("Songs fetched successfully:", results);
            }
    
            // Return the results (or an empty array if no songs)
            return callback(null, results);
        });
    }
};
module.exports = info;
