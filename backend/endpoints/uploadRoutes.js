const express = require("express");
const upload = require("../upload");

const router = express.Router();

// Upload a single image
router.post("/", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    res.json({ message: "File uploaded successfully!", filename: req.file.filename });
});

module.exports = router;
