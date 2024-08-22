const { default: mongoose } = require("mongoose");

exports.connectToDb = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/test2')
        console.log('db connnected')
    } catch (error) {
        console.log('db error')
    }
   
}

