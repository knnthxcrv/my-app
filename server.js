const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Set up storage engine for Multer
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize upload variable
const upload = multer({ storage: storage });

// Handle form submission
app.post('/submit', upload.single('fileUpload'), (req, res) => {
    const formData = req.body;
    const fileData = req.file;

    // Save form data and file metadata to database here (not shown in this example)

    // Respond with the file URL for download
    res.json({
        message: 'Form submitted successfully!',
        fileUrl: `/download/${fileData.filename}`
    });
});

// Handle file download
app.get('/download/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    res.download(filePath);
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});