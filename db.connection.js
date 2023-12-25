const mongoose = require('mongoose');
require("dotenv").config();
const constant=require("./constant")
exports.dbConnection=()=>
{ 
  let url=process.env.DB_URL
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected')   
  })
  .catch((err) => {
throw err();
});
}