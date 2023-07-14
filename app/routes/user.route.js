const express = require("express");
const { singupUser, loginUser, listOfUsers, userLoginPage, editUserData, updateUserData, deleteUserData } = require("../controllers/user.controller");
const userRoute = express.Router();

userRoute.post("/register", singupUser);
userRoute.post("/loginUser", loginUser);
userRoute.get("/list", listOfUsers);
userRoute.get("/edit/:id", editUserData);
userRoute.post("/update/:id", updateUserData);
userRoute.get('/delete/:id', deleteUserData);
userRoute.get('/login', userLoginPage);

module.exports = userRoute;