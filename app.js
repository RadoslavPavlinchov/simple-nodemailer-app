const express = require('express');
const bodyParser = require('body-parser');
const expHbs = require('express-handlebars');
const path = require('path')
const nodemailer = require('nodemailer');

const app = express();

// View engine setup
app.engine('handlebars', expHbs());
app.set('view engine', 'handlebars');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.render('contact', { layout: false });
});

app.listen(3000, () => console.log('Server started on port 3000'));
