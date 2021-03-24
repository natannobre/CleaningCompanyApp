const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Employee = new Schema({
    user_name: {
        type: String, 
        required: true
    },
    password: {
        type: String,
        required: true
    }, 
    first_name: {
        type: String,
        required: true
    }, 
    last_name: {
        type: String,
        required: true
    },     
    ssn: {
        type: String,
        required: true
    },  
    phone: {
        type: String,
        required: true
    }
})

mongoose.model("employee", Employee)
