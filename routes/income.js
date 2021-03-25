const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');

router.get("/add", (req, res) => {
    res.render("income/add_income");
})

module.exports = router;