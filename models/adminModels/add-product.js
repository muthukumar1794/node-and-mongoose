const mongoose = require('mongoose')
const Schema = mongoose.Schema
const productSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    specification:{
        type:String,
        required:true
    },
    amount:{
        type:String,
        required:true
    },
    imagePath:{
        type:String,
        required:true
    },
    userID:{
        type:Schema.Types.ObjectId,ref:'User'
    }

})

module.exports = mongoose.model('Product',productSchema)



// const getDb = require('../../config/db_config').getDb
// const mongodb = require('mongodb')

// class Product{ 
    
//     constructor(body,user,id){
//         this.user = user
//         this.title = body.title,
//         this.specification = body.specification,
//         this.amount = body.amount,
//         this.imagePath = body.imagePath
//         this._id = id ? new mongodb.ObjectID(id) : null
//    }

//    save(){
//         const db = getDb()

//        if(this._id){
//         return db.collection('products')
//         .updateOne({_id:this._id},{$set:this})
//         .then()
//         .catch(err=>{console.log("update error")})
//     }
//        else{
//        return db.collection('products')
//        .insertOne(this)
//        .then()
//        .catch(err=>{
//            console.log("errror",err)
//        })
//     }
//    }

//    static fetchall(){
//     const db = getDb()
//     return db.collection('products').find().toArray()
//     .then(productsData=>{
//         return productsData
//     })
//     .catch(err=>{
//         console.log("productsData error",err)
//     })
//    }

//    static findById(prodID){
//     const db = getDb()
//     return db.collection('products').find({_id:new mongodb.ObjectID(prodID)}).next()
//     .then(result=>{
//         console.log("result123",result)
//          return result
//     })
//     .catch(err=>{
//         console.log("details error",err)
//     })
//    }
//    static deleteById(prodID){
//        const ID = prodID
//        const db = getDb()
//        return db.collection('products').deleteOne({_id:new mongodb.ObjectID(ID)})
//        .then(deleted=>{
//            console.log("deleted",deleted)
//        }).catch(err=>console.log(err))
       
//    }
    
// }

// module.exports = Product