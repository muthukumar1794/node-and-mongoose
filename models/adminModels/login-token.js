const mongoose = require('mongoose')
const Schema = mongoose.Schema

const loginToken = new Schema({
    userID:{
        type:Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    loginID:{
        type:String,
        required:true        
    },
    loginValidation:{
        type:Date,
        required:true   
    },
    isActive:{
        type:Boolean,
        default:false
    }

})

module.exports = mongoose.model('logintoken',loginToken)
