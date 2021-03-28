const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
require("../models/contract")
const Contract = mongoose.model("contract")
const {isLogged} = require("../config/isLogged")

router.get("/dailyCleaning", (req, res) => {
    res.render("cleaning/dailyCleaning");
})

module.exports = router;