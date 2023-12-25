const express = require("express");
const app = express();
const userRoute=require('./routers/User.Route');
const db=require("./db.connection")
require("dotenv").config();


// middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// DB Connection
db.dbConnection()


app.use('/',userRoute)

app.listen(process.env.PORT, () => {
  console.log("listing at",process.env.PORT);
});
module.exports = app;