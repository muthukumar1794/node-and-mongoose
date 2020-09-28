const path = require('path')
const ProductCreation = require('../models/adminModels/add-product')
const { default: gpath } = require('../utility/path')


exports.getadminIndex = (req,res,next)=> {
    ProductCreation.fetchAll((p)=>{
        res.render(path.join(path.dirname(process.mainModule.filename),'views','admin-pages','admin-index.ejs'),{products:p})
        })
}

exports.addProducts = (req,res,next)=> {
    res.render(path.join(path.dirname(process.mainModule.filename),'views','admin-pages','edit-product.ejs'),{editing:false})
}

exports.addProductsData = (req,res,next)=>{
  const product =new ProductCreation(null,req.body)
  
  product.onsaveProducts()

  ProductCreation.fetchAll((p)=>{
    res.render(path.join(path.dirname(process.mainModule.filename),'views','admin-pages','admin-index.ejs'),{products:p})
    })

}

exports.editProductsData = (req,res,next)=>{
  console.log(("req.bodyyyyyyyyyyyyyyyyyyyyyyy",req.body))
  const prodID = req.body.prodid
  const product =new ProductCreation(prodID,req.body)
  
  product.onsaveProducts()

  ProductCreation.prodDetails(prodID,productDetail=>{
    res.render(path.join(gpath,'views','admin-pages','product-detail'),{product:productDetail})
      })

}

exports.updateProduct = (req,res,next)=>{
  const prodID = req.params.prodID
  const editingparam = req.query.edit
  if(editingparam=="true"){
    ProductCreation.prodDetails(prodID,productDetail=>{
      res.render(path.join(gpath,'views','admin-pages','edit-product'),{product:productDetail,editing:editingparam})
        })
  }
  else{
    res.redirect('/admin/product/details/'+prodID)
  }
}

exports.getProductDetails = (req,res,next)=> {
  const prod_id = req.params.prodid
  ProductCreation.prodDetails(prod_id,productDetail=>{
res.render(path.join(gpath,'views','admin-pages','product-detail'),{product:productDetail})
  })
}

exports.deleteProduct = (req,res,next)=>{
  console.log("pppppppppppppppppppppp")
  const prodID = req.params.prodID
  console.log('prooooood',prodID)
  ProductCreation.deleteProduct(prodID)
  ProductCreation.fetchAll((p)=>{
    res.render(path.join(path.dirname(process.mainModule.filename),'views','admin-pages','admin-index.ejs'),{products:p})
    })

}