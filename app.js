const express = require('express');
const bodyParser = require('body-parser');
const expHbs = require('express-handlebars');
const path = require('path')
const nodemailer = require('nodemailer');

const app = express();

// View engine setup
app.engine('handlebars', expHbs({
    defaultLayout: false,
}));
app.set('view engine', 'handlebars');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.render('contact', { layout: false });
});

app.post('/send', (req, res) => {
    const output = `
      <p>You have a new contact request</p>
      <h3>Contact Details</h3>
      <ul>  
        <li>Name: ${req.body.name}</li>
        <li>Company: ${req.body.company}</li>
        <li>Email: ${req.body.email}</li>
        <li>Phone: ${req.body.phone}</li>
      </ul>
      <h3>Message</h3>
      <p>${req.body.message}</p>
    `;

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.abv.bg', // tested sending with abv.bg
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'USERNAME', // generated ethereal user
            pass: 'PASSWORD'  // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Nodemailer" <USERNAME>', // sender address
        to: 'EMAIL', // list of receivers
        subject: 'Nodemailer', // Subject line
        text: 'Hello world?', // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        res.render('contact', { msg: 'Email has been sent' });
    });
});

app.listen(3000, () => console.log('Server started on port 3000'));
