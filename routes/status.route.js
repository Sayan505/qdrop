const express = require('express');
const router = express.Router();

// TODO
router.get("/", (req, res) => {
    res.send("Hello World!");
});

module.exports = router;
