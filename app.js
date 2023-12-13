const express = require("express");
const app = express();
const port = 3002;
const path = require("path");
const cors = require("cors");
const { default: axios } = require("axios");
const bodyParser = require('body-parser');

app.use(cors());
let url = 'https://trymystyle.co.in/'; 

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the HTML admin page when accessing "/admin"
app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/', (req, res) => {
    res.redirect(url);
});

app.post('/update-url', (req, res) => {
  const newUrl = req.body.newUrl;
  if (newUrl) {
      url = newUrl;
      res.json({ message: 'YouTube URL updated successfully', updatedUrl: url });
  } else {
      res.status(400).json({ error: 'Invalid URL' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

