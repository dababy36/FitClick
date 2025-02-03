const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const db = require("./db");

// Importing routes
const uploadRoute = require("./endpoints/uploadRoutes");
const userRoutes = require("./endpoints/userRoutes");

const app = express();
const PORT = 3000;

// Middleware setup
app.use(cors()); // Allows cross-origin requests
app.use(bodyParser.json()); // Parses JSON request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads")); // Serves uploaded images

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

// Add these test routes at the top of your routes section
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working' });
});

app.get('/api/users/test', (req, res) => {
    res.json({ message: 'Users route is working' });
});

app.get('/api/test-db', (req, res) => {
    db.query('SELECT 1 as test', (err, results) => {
        if (err) {
            console.error('Database test error:', err);
            return res.status(500).json({ error: 'Database connection failed', details: err.message });
        }
        res.json({ message: 'Database connection successful', results });
    });
});

// Define API routes
app.use("/api/users", userRoutes); // User operations
app.use("/api/upload", uploadRoute); // Image uploads

// Serve static files from the frontend folder
app.use(express.static(path.join(__dirname, "..", "frontend")));

// Serve index.html for the main page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "frontend", "index.html"));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}).on('error', (err) => {
    console.error('Server error:', err);
});
