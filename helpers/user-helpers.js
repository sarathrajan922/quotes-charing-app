var db = require("../config/connection");
var collection = require("../config/collections");



module.exports ={

    getAllData:  (logdata)=>{
        
        return new Promise (async(resolve ,reject)=>{
            let data = await db.get().collection(collection.USER_COLLECTION).find({email: logdata}).toArray()
            resolve(data);
        }) 
    },

    activityUpdate : (email,msg) =>{
        return new Promise (async(resolve, reject )=>{
             await db.get().collection(collection.USER_COLLECTION).findOneAndUpdate({email: email},{$push:{ quote : msg}}).then(data =>{
                resolve(data);
             })
        })
    }

}