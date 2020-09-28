const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  
email:{
    type:String,
    required:true
},
password:{
    type:String,
    required:true
},
resetToken:String,
userTokenExpiry:Date,
cart:{
    items:[
        {productID:{type:Schema.Types.ObjectId,ref:'Product',
        required:true
    },
        quantity:{type:Number,required:true}
    }
    ]
}

})

userSchema.methods.AddToCart = function(prodID){
    let newQuantity = 1
    let updatedCart
    if(this.cart.items==null){
        updatedCart = {items:[{productID:mongoose.Types.ObjectId( prodID),quantity:1}]}
    }
    else{
    const productIndex = this.cart.items.findIndex(p=>{
        return p.productID.toString() === prodID.toString()
    })

    if(productIndex>-1){
       const oldQty = this.cart.items[productIndex].quantity 
      this.cart.items[productIndex].quantity = oldQty + newQuantity
      updatedCart = this.cart
    }
   if(productIndex==-1){
       this.cart.items.push({productID:prodID,quantity:newQuantity})
      
        updatedCart = this.cart
        console.log("updated cart",updatedCart)
    }
}
this.cart = updatedCart

return this.save()
}

userSchema.methods.clearCart = function(){
    this.cart.items = []
    return this.save()
}
module.exports = mongoose.model('user',userSchema)


// const getDb = require('../../config/db_config').getDb
// const Product = require('../../models/adminModels/add-product')
// const _ = require('lodash')
// const mongodb = require('mongodb')
// class User{
//     constructor(body,cart) {
//         this._id = body._id
//         this.email = body.email,
//         this.password = body.password
//         this.cart = body.cart
//     }
//    save(){
//     const db = getDb()
//     return db.collection('user').insertOne(this)
//     .then(result=>{
//         console.log("result")
//     })
//     .catch(err=>{
//         console.log("user model creation error",err)
//     })
//    } 

//             updateCart(ID){
//                 const db = getDb()
//                 const id = new mongodb.ObjectID(ID)
//                 let updatedItems
//                 const newQuantity = 1

//                 if(this.cart!=null){
//                     if(_.isEmpty(this.cart.items)){ console.log("loadash")
//                         updatedItems = [{productID:id,quantity:newQuantity}]
//                 }
//                 else{
//                 const cartItemArray = [...this.cart.items]
//                 const cartItemsindex = cartItemArray.findIndex(c=>c.productID.toString()==id.toString())
                
//             if(cartItemsindex>-1){
//             const oldQty = cartItemArray[cartItemsindex].quantity + newQuantity
//             cartItemArray[cartItemsindex].quantity = oldQty
//             updatedItems = cartItemArray
//             }
//             else{
//                 cartItemArray.push({productID:id,quantity:newQuantity})
//                 updatedItems = cartItemArray
//             }}
//             }
//             else{
//                 updatedItems = [{productID:id,quantity:newQuantity}]
//             }
//             return db.collection('user')
//                 .updateOne({_id:new mongodb.ObjectID(this._id)},{$set:{cart:{items:updatedItems}}})
//                 .then(cart=>{
//                 }).catch(err=>{console.log("cart adding errrrrr")})
//             }

//    static getCart(user){
//         const db = getDb()
        
//         const product_id = user.cart.items.map(p=>{
//             return new mongodb.ObjectID(p.productID)
//         })
//         console.log("cartitems",product_id)
//           return db.collection('products').find({_id:{$in:product_id}}).toArray()
//            .then(products=>{
//              return  products.map(p=>{return {...p,quantity:user.cart.items.find(cart=>cart.productID.toString()===p._id.toString()).quantity}})
//         }).catch(err=>{console.log("error while get cart",err)})
//    }

//    static deleteCartProduct(ID,user){
//         const db = getDb()
//       const updatedCart = user.cart.items.filter(p=>p.productID.toString()!==ID.toString())
//        return db.collection('user').updateOne({_id:new mongodb.ObjectID(user._id)},{$set:{cart:{items:updatedCart}}})
//        .then(result=>{
//         console.log("{reeeeeeeeeee}",result)
//         return result
//        }).catch(err=>{
//            console.log("err while deleting",err)
//        })
//    }

//    static cartCheckout(user){
//        const db = getDb()
//      return  User.getCart(user).then(products=>{
//         const orderobj={
//             products:products,
//             user_id:user._id,user_email:user.email
//         }
//         return db.collection('orders').insertOne(orderobj).then(orders=>{
//               db.collection('user').updateOne({_id:new mongodb.ObjectID(user._id)},{$set:{cart:{items:[]}}}).then(checkout=>{console.log("checkout successfull")}).catch(err=>{console.log("error checkout"),err})
//         })
//     })
       

//    }

//    static myOrders(user){
//        const db = getDb()
//         const userID = user._id
        
//        return db.collection('orders').find({user_id:new mongodb.ObjectID(userID)}).toArray().then(orders=>{
//         return orders
    
//     })
   
//    }

//    static fetchAllUsers(){
//     const db = getDb()
//     return db.collection('user').find().toArray()
//     .then(users=>{
//         console.log("ussssssssssssser",users)
//         return users
//     })
//     .catch(err=>{
//         console.log("user fetch all user",err)
//     })
//    }

//    static findById(userid){
//        const ID = new mongodb.ObjectID(userid)
//        const db = getDb()
//        return db.collection('user').find({_id:ID}).next()
//        .then(user=>{
//            console.log("usesrrer",user)
//            return user
//        }).catch(err=>{console.log("1 user finfing error",err)})
//    }
// }

// module.exports = User