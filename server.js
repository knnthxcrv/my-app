const express = require('express');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://username:password@cluster0.mongodb.net/my-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

// Define a schema for the form data
const formDataSchema = new mongoose.Schema({
    created: String,
    agency: String,
    requestedBy: String,
    market: String,
    agentName: String,
    eid: String,
    returnLabelStreetAddress: String,
    city: String,
    state: String,
    zipCode: String,
    cellPhone: String,
    emailAddress: String,
    termDate: String,
    packagingRequested: Boolean,
    packageUPSTracker: String,
    agencyCollectionNotes: String,
    trainingOrProduction: String,
    classCode: String,
    duplicateOr2ndRequest: Boolean,
    upsTrackingNumber: String,
    labelDeactivated: Boolean,
    shippingLabelStatus: String,
    radialNotes: String,
    dateOfUpdate: String,
    fileUrl: String
});

// Create a model for the form data
const FormData = mongoose.model('FormData', formDataSchema);

// Serve static files
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
app.post('/submit', upload.single('fileUpload'), async (req, res) => {
    const formData = req.body;
    const fileData = req.file;

    // Replace blank fields with "None"
    for (const key in formData) {
        if (formData[key] === '') {
            formData[key] = 'None';
        }
    }

    // Add file URL to form data
    formData.fileUrl = fileData ? `/download/${fileData.filename}` : null;

    // Save form data to MongoDB
    try {
        const newFormData = new FormData(formData);
        await newFormData.save();
        res.json({
            message: 'Form submitted successfully!',
            data: newFormData
        });
    } catch (err) {
        console.error('Error saving form data:', err);
        res.status(500).json({ error: 'Failed to save form data' });
    }
});

// Handle file download
app.get('/download/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    res.download(filePath);
});

// Fetch all records
app.get('/records', async (req, res) => {
    try {
        const records = await FormData.find();
        res.json(records);
    } catch (err) {
        console.error('Error fetching records:', err);
        res.status(500).json({ error: 'Failed to fetch records' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});