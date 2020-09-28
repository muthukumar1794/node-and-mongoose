const { ObjectID } = require('mongodb')
const mongoose =  require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new Schema({
    userID:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    order:[{
            products:{type:Object,
            required:true},
            quantity:{type:Number,required:true}
    }]
})

module.exports = mongoose.model('order',orderSchema)