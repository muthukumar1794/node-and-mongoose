const Product = require('../models/adminModels/add-product')
const User = require('../models/adminModels/user')
const Order = require('../models/shop-models/order')
const path = require('path')
import gpath from '../utility/path'
const fs = require('fs')
const PDFDOC = require('pdfkit')


exports.getHome = (req,res,next)=>{
    // const cookie = req.get('Cookie').split('=')[1]
   console.log("req.user._id",req.user._id)
    Product.find({userID:req.user._id})
    .skip((1-1) * 2)
    .limit(2)
    .then(products=>{
        res.render(path.join(gpath,'views','product-pages','home'),{products:products})
    })
    .catch(err=>{
        console.log("get admin index",err)
    })
}

exports.addToCart = (req,res,next)=>{
    User.findOne({_id:req.user._id}).then(user=>{
        user.AddToCart(req.body.add_to_cart_id)
    }).then(result=>{
        res.redirect('/shop/cart')
    })

}

exports.cartView = (req,res,next)=>{
    req.user.populate('cart.items.productID')
   .execPopulate()
.then(products=>{
    console.log("hhhhhhhhhhhh",products)
    res.render(path.join(gpath,'views','product-pages','cart'),{cartproducts:products})
})
.catch(error=>{console.log("get cart error",error)})
}

exports.DeleteCartProduct = (req,res,next)=>{
    const prodID = req.params.prodID
    User.deleteCartProduct(prodID,req.user)
    .then(result=>{
        console.log("resulttttt")
        res.redirect('/shop/cart')
    })
}

exports.Checkout = (req,res,next)=>{
    req.user.populate('cart.items.productID')
    .execPopulate()
    .then(user=>{
        const products = user.cart.items.map(p=>{
            return{products:{...p.productID._doc},quantity:p.quantity}
         })
            const order = new Order({
             userID:req.user,
             order:products
         })
        return order.save()
         })
        .then(p=>{
            req.user.clearCart()
}).then(success=>{
        res.redirect('/admin/index')
    }).catch(err=>{
        console.log("checkout error",err)
    })

}

exports.myOrders = (req,res,next)=>{
   Order.find({userID:req.user._id})
   .populate('userID')
   .exec().then(myorders=>{
        console.log("orrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr",myorders)
        res.render(path.join(gpath,'views','product-pages','my-orders'),{orders:myorders})
    })
.catch(error=>{
    console.log("erererere",error)
})

 
}

exports.orderInvoice = (req,res,next)=>{

  const orderID =  req.params.orderID
  console.log("orderid",orderID,req.user._id)
    Order.findOne({_id:orderID,userID:req.user._id})
    .then(order=>{
        console.log("IIIINNNNN",order)
      
    const invoiceName = "order.pdf"
    const invoicePath = path.dirname(process.mainModule.filename)

    ////      synchronous file read ////

    // return fs.readFile(path.join(invoicePath,'images','invoices',invoiceName),(err,filecontent)=>{
    //     if(err){
    //         console.log("qwqwqwqwqwqwq",err)
    //         return err
    //     }
    //     res.setHeader('Content-Type','application/pdf')
    //     res.setHeader('Content-Disposition','inline;filename="'+invoiceName+'"')
    //    return res.send(filecontent)
// })
 ////      synchronous file read end ////


 ////      create read stream  ////

    // const file = fs.createReadStream(path.join(invoicePath,'images','invoices',invoiceName))

    // res.setHeader('Content-Type','application/pdf')
    // res.setHeader('Content-Disposition','inline;filename="'+invoiceName+'"')
    // return file.pipe(res)
   
 ////      create read stream end ////

const pdf = new PDFDOC()
res.setHeader('Content-Type','application/pdf')
res.setHeader('Content-Disposition','inline;filename=ooooooooooooooooo')
pdf.pipe(fs.createWriteStream(path.join(invoicePath,'images','invoices',invoiceName)))

pdf.pipe(res)
         order.order.map((p,index)=>{
             if(order.order.length>0){
                 pdf.fontSize(25).text("product - "+Number(index+1))
             }
       
        pdf.fontSize(15).text(p.products.title +"  -  "+  p.products.amount)
        pdf.text('\n')
        pdf.fontSize(20).text("Quantity  -  "+p.quantity)
        pdf.text('\n')
         })


pdf.end()

    }).catch(error=>{
        console.log("pppppppppppppp")
        throw error
    })
}