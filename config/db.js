const mongoose = require('mongoose');

const connectDB = async () => {
    try { 
        // const connection = await mongoose.connect('mongodb://127.0.0.1:27017/realestateapp', {
        //     useNewUrlParser:'true'
        // })  
        const connection = await mongoose.connect('mongodb+srv://neemapssree123:neemapssree123@cluster0.zcm3etm.mongodb.net/', {
            useNewUrlParser:'true'
        })
        console.log("MongoDB connected");
    } catch(err) {
        console.log(err);
    }
}

module.exports=connectDB;