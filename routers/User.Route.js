const express = require("express");
const userRoute=express.Router();
const userService=require('../services/User.Service')

userRoute.post("/api/users",userService.createUser)
userRoute.get("/api/users",userService.getAllUsers)
userRoute.get("/api/users/:userId",userService.getUserById)
userRoute.put("/api/users/:userId",userService.upadteUserById)
userRoute.delete("/api/users/:userId",userService.deleteUserById)
userRoute.get("*",userService.nonHandleRequest)
userRoute.post("*",userService.nonHandleRequest)
userRoute.put("*",userService.nonHandleRequest)
userRoute.delete("*",userService.nonHandleRequest)

module.exports=userRoute