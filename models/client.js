const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Client = new Schema({
    email: {
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

mongoose.model("client", Client)
// {
// 	"email": "",
// 	"first_name": "",
// 	"last_name": "",
// 	"cpf": "",
// 	"phone": ""
// }