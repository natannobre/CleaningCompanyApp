const mongoose = require('mongoose')
const Schema = mongoose.Schema
require('./client')
const Client = mongoose.model("client")
require('./employee')
const Employee = mongoose.model("employee");

const Contract = new Schema({
    
    client: {
        type: Schema.Types.ObjectId,
        ref: Client,
        required: true
    },
    employee: {
        type: Schema.Types.ObjectId,
        ref: Employee,
        required: true
    },    
    contract_price: {
        type: String,
        required: true
    }, 
    contract_type: {
        type: String,
        required: true
    },
    expiration: {
        type: Date,
        required: true
    },  
    status: {
        type: Boolean,
        required: true,
        default: true
    },
    address: {
        zipcode: {
            type: String,
            required: true
        },
        street: {
            type: String,
            required: true
        },  
        number: {
            type: Number,
            required: true
        },     
        neighborhood: {
            type: String,
            required: true
        },           
        state: {
            type: String,
            required: true
        },   
        city: {
            type: String,
            required: true
        },                           
    },
    nextCleaning: {
        type: Date,
        required: true
    }

})

mongoose.model("contract", Contract)
// contrato
// {
//   "client_id": "",
//   "contract_price": "",
//   "contract_type": "",
//   "validity": "",
//   "status": true,
//   "address": {
//     "zipcode": "",
//     "street": "",
//     "number": "",
//     "neighborhood": "",
//     "sub_division": "",
//     "city": ""
//   }
// }