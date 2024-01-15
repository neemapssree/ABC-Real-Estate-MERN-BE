const mongoose = require('mongoose');
const users = require('./userModel');

const bookingSchema = new mongoose.Schema({
    date: {
        type:Date,
        required:true,
    },
    slot: {
        type:Object,
        required:true,                  //Each time slots will add as each object
    },
    bookedBy: {
        type:mongoose.Types.ObjectId,
        ref:'users',                  
    },
    cancellation: {
        type:Array,                 
    },
    propId: {
        type:mongoose.Types.ObjectId,
        ref:'properties',               
    },
    orderId: {
        type:String,                  
    },
})

const schedules = mongoose.model("schedules",bookingSchema);
module.exports = schedules;