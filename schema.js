const { default: mongoose, mongo } = require("mongoose");

const userSchema = mongoose.Schema({
    name:{
        type:String
    },
    description:{
        type:String
    }cds
})cdsc
userSchema.index({name:'text'})

exports.User = mongoose.model('user',userSchema)