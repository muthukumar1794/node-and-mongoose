const path = require('path')
import { getMaxListeners } from '../models/adminModels/user'
import loginRouter from '../routes/login-routes/login'
import gpath from '../utility/path'
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/adminModels/user')
const loginToken = require('../models/adminModels/login-token')
const nodemailer = require('nodemailer')
const sendGrid = require('nodemailer-sendgrid-transport')
const {validationResult} = require('express-validator')


const transporter = nodemailer.createTransport(sendGrid({
    auth:{
        // api_user:'mutghu name',
        // api_key:'password'
        api_key:'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'
    }
}))

exports.postLogin = (req, res, next) => {
const errors = validationResult(req).errors[0]
    console.log("validatoon errorsd",errors)
if(errors){
   return res.render(path.join(gpath, 'views', 'product-pages', 'login'),{errorMessages:errors.msg})
}
    User.findOne({
        email: req.body.email
    }).then(user => {
        req.session.user = user
        let loginuser;
       bcrypt.compare(req.body.password, user.password).then(success=>{
           if(success){
            
        // if (user) {
        
            const jwtToken = jwt.sign({
                email: user.email,
            }, 'secret')
            // console.log("jwtTokenjwtTokenjwtToken", jwtToken)
            //req.session.jwt = jwtToken

            const logintoken = new loginToken({
                userID:user,
                loginID:jwtToken,
                loginValidation:Date.now()+3.6e+6,
                isActive:true
            })
            return logintoken.save().then(success=>{

               return res.redirect('/shop/index')
            }).catch(err=>{
                console.log("logintoken err",err)
                throw err
            })
          }
        // }
          return res.redirect('/shop/login/form')
       }).catch(err=>{
           console.log("bcrdypt eerrr",err)

       })
      

    }).catch(err => {
        console.log("errrror", err)

        res.redirect('/shop/login/form')
    })
    //  jwt.verify(req.body.token,'adidas')

    //    req.session.save(err=>{

    // })


}
exports.logout = (req,res,next)=>{

    console.log(("logout",req.user._id))
    loginToken.findOne({userID:req.user._id,isActive:true}).then(login=>{
        login.isActive=false
        login.save().then(success=>{
        req.session.destroy()
        res.redirect('/shop/login/form')
        }).catch(err=>{console.log("logount error",err)})
     }).catch(err=>{
         console.log("err",err)
          res.send("<h1>Not found</h1>")
      })
    
}

exports.loggedIN = (req, res, next) => {
    req.session.destroy()
   
  res.render(path.join(gpath, 'views', 'product-pages', 'login'),{errorMessages:""})
       
}

exports.getSignup = (req, res, next) => {
    res.render(path.join(gpath, 'views', 'product-pages', 'signup'))
}
exports.postSignup = (req, res, next) => {
    console.log("reeeeeeeeeaqq", req.body)
    const body = req.body
    if (body) {
        if (body.password != body.confirmPassword) {
            return res.redirect('/shop/signup')
        }
        if (body.email.length > 1) {
           return User.findOne({email:body.email}).then(userexist=>{
                if(!userexist){
                   return bcrypt.hash(body.password, 12, function (err, hash) {
                        if (err) {
                            console.log("error hashinh", err)
                            return err
                        }
                        const user = new User({
                            email: body.email,
                            password: hash,
                            cart: {
                                items: []
                            }
                        })
                        user.save().then(success => {
                           return res.redirect('/shop/login/form')
                        }).catch(err => {
                            console.log("errror user create", err)
                        })
                    })
                }

                return res.redirect('/shop/signup')
            })

          
        }
    }

}

exports.resetPassword = (req,res,next)=>{
    res.render(path.join(gpath, 'views', 'product-pages', 'reset-password'))
}

exports.passwordReset = (req,res,next)=>{
   User.findOne({email:req.body.email}).then(user=>{
    const token = jwt.sign({email:user.email},'secret')
    console.log("jettoken",token)
    user.resetToken = token,
    user.userTokenExpiry = Date.now() + 60000
   return user.save().then(result=>{
        res.send('<p>Reset link was sent to your mail</p>')
        transporter.sendMail({
            to:req.body.email,
            from:'muthukumarc1215@gmail.com',
            subject:'Reset password',
            html:`<h5>Do you want to reset your password</h5>
            <p><a href="http://localhost:3000/shop/login/new-password/${token}">click this link</a>
            `})
  
    })
})
    .catch(err=>console.log("nodemailer error",err))
}

exports.newPassword = (req,res,next)=>{
    User.findOne({resetToken:req.params.token,userTokenExpiry:{$gt:Date.now()}}).then(user=>{
        console.log("token validation",user)
        if(user){
            return res.render(path.join(gpath, 'views', 'product-pages', 'new-password'),{tokenID:req.params.token})
        }
        return res.send("<h1>your link was expired</h1>")
    }).catch(err=>{
        console.log("errrrrrr token",err)
       
    })
   
}
exports.postNewPassword = (req,res,next)=>{

    if(req.body.password === req.body.confirmPassword){
        let hashed;
        User.findOne({resetToken:req.params.token,userTokenExpiry:{$gt:Date.now()}}).then(user=>{
           bcrypt.hash(req.body.password,12)
               hashed = hash
           }).then(success=>{
            console.log("hash check 12331231",hashed)
            user.password = hashed
            user.save().then(success=>{
                if(success){
                  return  res.redirect('/shop/login/form')   
                }
               return res.send('<h1>your session was expired</h1>')
            })
        }).catch(err=>{
            console.log("error",err)
           return res.send('<h1>your session was expired</h1>')
        })
}
else{
    res.redirect('/shop/login/new-password/'+req.params.token)
}

}