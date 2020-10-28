const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
require('dotenv').config()

const app = express();

app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);

app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use('/', require('./routes/index'))
app.use(express.static('public'));

app.use(function(req, res) {
    res.status(404)
    res.render('404')
});

app.use(function(error, req, res, next) {
    res.status(500)
    res.render('500')
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));