const express = require("express");
const db = require("../db");
const bcrypt = require('bcryptjs');

const router = express.Router();




// Get all users with better error handling
router.get("/list", (req, res) => {
    console.log('List users route hit'); // Debug log

    const query = "SELECT id, name, email, type, active, created_at FROM users ORDER BY created_at DESC";
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database error in /list:', err);
            return res.status(500).json({ 
                error: "Error fetching users",
                details: err.message 
            });
        }
        
        console.log('Query results:', results); // Debug log
        res.json({ users: results || [] });
    });
});

// Add user with password hashing
router.post("/add", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Basic validation
        if (!email || !password || !name) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                error: "Invalid email format",
                details: "Please enter a valid email address (example@domain.com)"
            });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const type = 'user';
        const query = "INSERT INTO users (name, email, password, type) VALUES (?, ?, ?, ?)";
        
        db.query(query, [name, email, hashedPassword, type], (err, results) => {
            if (err) {
                console.error('Database error in /add:', err);
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ 
                        error: "Email already exists",
                        details: "Please use a different email address"
                    });
                }
                return res.status(500).json({ 
                    error: "Error creating user",
                    details: err.message 
                });
            }
            console.log('Insert results:', results);
            res.json({ message: "User added successfully!", userId: results.insertId });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ 
            error: "Error creating user",
            details: "Internal server error while processing request"
        });
    }
});

module.exports = router;
