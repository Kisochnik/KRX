const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'frontend')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.listen(PORT, function() {
  console.log('KVARON_X running on port ' + PORT);
});
