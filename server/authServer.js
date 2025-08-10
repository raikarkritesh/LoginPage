require('dotenv').config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());

//login user
app.post("/login", async(req,res) => {
    const user = users.find((user) => user.name === req.body.name);
    if (user == null){
        return res.status(400).send("Cannot find user");
    }
    
    try {
        if(await bcrypt.compare(req.body.password, user.password)){
            const accessToken = jwt.sign({name : user.name}, process.env.ACCESS_TOKEN_SECRET)
            res.status(200).json({accessToken: accessToken});
        }else{
            res.status(400).send("Invalid Credentials");
        }
    } catch  {
        res.status(500).send();
    }
})