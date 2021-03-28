const mongoose = require('mongoose');
const Schema = mongoose.Schema
require('./contract')
const Contract = mongoose.model('contract');
require('./employee')
const Employee = mongoose.model('employee');

const Cleaning = new Schema({
    date: {
        type: Date,
        required: true
    },
    status: {
        type: Boolean,
        default: false
    },
    employee: {
        type: Schema.Types.ObjectId,
        ref: Employee,
        required: true
    },
    contract: {
        type: Schema.Types.ObjectId,
        ref: Contract,
        required: true
    }

});

mongoose.model("cleaning", Cleaning);

