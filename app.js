const express= require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const mongodb = require('mongodb')
const mongoose = require('mongoose')
const session = require('express-session')
const mongodbStore = require('connect-mongodb-session')(session)
const multer = require('multer')

const allRoutes = require('./routes/route-container')
const mongoConnect = require('./config/db_config').mongoConnect
const User = require('./models/adminModels/user')
const Storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        console.log("cbcbcbcbcbcb")
        cb(null,'images')
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now().toString()+"-"+file.originalname)
    }
})
const fileFilter = (req,file,cb)=>{
    console.log("222222")
        if(file.mimetype === 'image/png' || file.mimetype === 'application/pdf'){
            cb(null,true)
        }else{
        cb(null,false)
    
    }
}

app.use('/images',express.static(path.join(__dirname,'images')));
app.use(cors())
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.engine('ejs', require('ejs').__express);
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(multer({storage:Storage,fileFilter:fileFilter}).any())

const Store = new mongodbStore({
    uri:'mongodb+srv://muthukumar:muthukumar1234@cluster0.8ekgi.mongodb.net/emart',
    collection:'session'
})
app.use(require('express-session')({
    secret: 'This is a secret',
    store: Store,
    resave: true,
    saveUninitialized: false
  }));
app.use((req,res,next)=>{
  
   if(!req.session.user){
      return next()
   }
    
   return User.findOne({_id:req.session.user._id})
    .then(user=>{
        //console.log("got user app.js",user)
        req.user = user
        return next()
     })
     .catch(error=>{console.log("error",error)})


    })

    allRoutes.map(Routes=>{app.use(Routes)})

mongoose.connect('mongodb+srv://muthukumar:muthukumar1234@cluster0.8ekgi.mongodb.net/emart',{ useNewUrlParser: true, useUnifiedTopology: true }).then(success=>{
    app.listen(3000)
    console.log("db connexted")
}).catch(err=>{
    throw err
})