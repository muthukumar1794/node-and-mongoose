const path = require('path')
const User = require('../models/adminModels/user')
import gpath from '../utility/path'

exports.getUser = (req,res,next)=>{
    User.fetchAllUsers().then(users=>{
        res.render(path.join(gpath,'views','admin-pages','user-table'),{users:users})
    }).catch(err=>{
        console.log("error getuser controllers",err)
    })
    
}

exports.addUserData = (req,res,next)=>{
    const body = req.body
    console.log("req.body",req.body)
    const user = new User(body)
    user.save()
    .then(user=>{
        console.log(user)
        res.redirect('/admin/get-user')
    })
}

exports.addUser = (req,res,next)=>{
    res.render(path.join(gpath,'views','admin-pages','edit-user'),{editing:false})
}