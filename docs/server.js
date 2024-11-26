const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = process.env.PORT || 8888;

// Enable CORS for all routes
app.use(cors());

// Serve static files from the docs directory
app.use(express.static(__dirname));

// Special handling for markdown files
app.get('/*.md', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.sendFile(path.join(__dirname, req.path));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});