const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Income = new Schema({
    value: {
        type: Number, 
        required: true
    },
    type: {
        type: String,
        required: true
    }, 
    date: {
        type: Date,
        required: true
    }, 
    description: {
        type: String,
        required: true
    }
})

mongoose.model("income", Income)