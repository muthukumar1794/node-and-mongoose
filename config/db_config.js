// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient

// let _db;
// const mongoConnect = callback =>{
//     MongoClient.connect('mongodb+srv://muthukumar:muthukumar1234@cluster0.8ekgi.mongodb.net/emart?retryWrites=true&w=majority', {useNewUrlParser: true,
//     useUnifiedTopology: true,})
//     .then(result=>{
//         console.log("connected")
//        _db = result.db()
//        callback()
//     })
//     .catch(err =>{
//         console.log("errrrrrrrr",err)
//         throw err
        
//     })
// }

// const getDb = ()=>{
//     if(_db){
//         return _db
//     }
//     throw "no database found"
// }

// exports.mongoConnect = mongoConnect
// exports.getDb = getDb