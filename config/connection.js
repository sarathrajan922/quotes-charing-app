var MongoClient = require('mongodb').MongoClient

const state ={
    db:null
}

module.exports.connect= (done)=>{
    const url = 'mongodb://0.0.0.0:27017'
    const dbname =  'shopping'

    MongoClient.connect(url, async(err,data)=>{
        if(err)
        return done(err)
        state.db=await data.db(dbname)
        done()
    })

}

module.exports.get =()=>{
    return state.db
}
