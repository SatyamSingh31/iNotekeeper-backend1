
//here we are connecting to database

const mongoose= require('mongoose')
const mongoURI= "mongodb+srv://satyamsingh08481:233125@cluster0.ra3gaso.mongodb.net/test?retryWrites=true&w=majority"

const connectToMongo = ()=>{
    mongoose.connect(mongoURI , function(){
    
        console.log("satyam singh")
    })
}

module.exports = connectToMongo