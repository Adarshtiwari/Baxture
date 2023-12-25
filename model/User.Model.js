const mongoose=require('mongoose')

let users= new mongoose.Schema({
    id:String,
    username:String,
    age:String,
    hobbies :Object
})

module.exports=mongoose.model('users',users,'users')