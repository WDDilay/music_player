const express= require('express');
const bodyParser= require('body-parser');
const routes = require('./routes/router.js');
const session = require('express-session');
const app = express();
const path = require('path');


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use('/', routes);
app.use(express.static('public'));





app.listen(3005, () => {
    console.log('Server is running on port http://localhost:3005');
});
