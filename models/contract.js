const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Contract = new Schema({
    client_id: {
        type: String, 
        required: true
    },
    client_name: {
        type: String, 
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
    employee:{
        employee_id: {
            type: String,
            required: true
        },
        employee_name: {
            type: String,
            required: true
        } 
    },
    cleanings:{
        type: Object
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