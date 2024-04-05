const express = require('express');
const db = require('./db');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const port = 8080;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (error, results) => {
      if (results.length > 0) {
        req.session.loggedin = true;
        req.session.username = username;
        res.redirect('/dashboard');
      } else {
        res.send('Incorrect username and/or password!');
      }
      res.end();
    });
  } else {
    res.send('Please enter username and password!');
    res.end();
  }
});

app.get('/dashboard', (req, res) => {
  if (req.session.loggedin) {
    res.send('Welcome back, ' + req.session.username + '!');
  } else {
    res.send('Please login to view this page!');
  }
  res.end();
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

