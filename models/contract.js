const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Client = new Schema({
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
        type: date,
        required: true
    },  
    status: {
        type: bool,
        required: true
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
            type: number,
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
    }    
})

mongoose.model("client", Client)
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