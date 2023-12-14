const express = require("express");
const app = express();
const port = 3002;
const path = require("path");
const cors = require("cors");
const bodyParser = require('body-parser');
const readline = require('readline');
const fs = require('fs');
const { exec } = require('child_process');

app.use(cors());
// let url = 'https://trymystyle.co.in/';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the HTML admin page when accessing "/admin"
app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// app.get('/', (req, res) => {
//     res.redirect(url);
// });

app.post('/update-url', (req, res) => {
    const newUrl = req.body.newUrl;
    if (newUrl) {
        url = newUrl;
        // Update the URL in .bashrc
        updateBashrcUrl(newUrl, (err) => {
            if (err) {
                res.status(500).json({ error: 'Failed to update .bashrc' });
            } else {
                res.json({ message: 'URL updated successfully', updatedUrl: url });
            }
        });
    } else {
        res.status(400).json({ error: 'Invalid URL' });
    }
});

app.post('/connect-wifi', (req, res) => {
  const { ssid, password } = req.body;

  // Use the exec function to run Wi-Fi connection commands

  exec(`sudo nmcli device wifi connect ${ssid} password ${password}`, (error, stdout, stderr) => {
      if (error) {
          console.error('Error:', error);
          res.status(500).json({ error: 'Failed to connect to Wi-Fi' });
          return;
      }

      console.log('Wi-Fi connection result:', stdout);
      console.error('Wi-Fi connection error:', stderr);

      // Check stdout or stderr for the connection result
      if (stdout.includes('successfully activated')) {
          res.json({ message: 'Connected to Wi-Fi' });
      } else {
          res.status(500).json({ error: 'Failed to connect to Wi-Fi' });
      }
  });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

// Function to update the URL in .bashrc
function updateBashrcUrl(newUrl, callback) {
  const bashrcPath = '/home/aaron/.bashrc'; // Update with your actual path
  const rl = readline.createInterface({
      input: fs.createReadStream(bashrcPath),
      output: process.stdout,
      terminal: false
  });

  const newLines = [];
  let updated = false;

  rl.on('line', (line) => {
      if (line.startsWith("chromium-browser --start-fullscreen --incognito")) {
          updated = true;
          newLines.push(`chromium-browser --start-fullscreen --incognito '${newUrl}'`);
      } else {
          newLines.push(line);
      }
  });

  rl.on('close', () => {
      if (updated) {
          // Update .bashrc with the new lines
          fs.writeFileSync(bashrcPath, newLines.join('\n'));
          callback(null);
      } else {
          callback('URL not found in .bashrc');
      }
  });
}
