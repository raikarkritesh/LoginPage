require('dotenv').config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { configDotenv } = require("dotenv");
const app = express();
app.use(express.json());

//To be stored and fetched from database later
const posts = [
    {
        userName: "Kree",
        title: "post1",
    },
    {
        userName: "Jim",
        title: "post2",
    },
];

const users = [];

let refreshTokkens = [];

//fetch posts
app.get("/posts", authenticateToken, (req, res) => {
    res.json(posts.filter(post => post.userName === req.user.name));
});

//fetch users TO BE REMOVED
app.get("/users", (req, res) => {
    res.json(users);
});

//register user
app.post("/register", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = { name: req.body.name, password: hashedPassword };
        users.push(user);
        res.status(201).send(user);
    } catch {
        res.status(500).send()
    }
});

//login user
app.post("/login", async(req,res) => {
    const user = users.find((user) => user.name === req.body.name);
    if (user == null){
        return res.status(400).send("Cannot find user");
    }
    
    try {
        if(await bcrypt.compare(req.body.password, user.password)){
            const userKey = {name : user.name};
            const accessToken = generateAccesstoken(userKey);
            const refreshToken = jwt.sign(userKey, process.env.REFRESH_TOKEN_SECRET);
            refreshTokkens.push(refreshToken);
            res.status(200).json({accessToken: accessToken, refreshToken: refreshToken});
        }else{
            res.status(400).send("Invalid Credentials");
        }
    } catch  {
        res.status(500).send();
    }
})

//logout user
app.delete("/logout", (req, res)=>{
refreshTokkens = refreshTokkens.filter(token => token !== req.body.token);
res.sendStatus(204);
})

//post refreshToken to create new accessToken
app.post("/token", (req, res) => {
    const refreshToken  = req.body.token;
    if(refreshToken == null) return res.sendStatus(401);
    if(!refreshTokkens.includes(refreshToken)) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, userKey) => {
        if(err) return res.sendStatus(403);
        const accessToken = generateAccesstoken({name: userKey.name});
        res.json({accessToken: accessToken});
    })
})

//generate accesstoken
function generateAccesstoken(userKey){
    return jwt.sign(userKey, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15s'})
}

//authenticate users
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, userKey) => {
        if(err) return res.sendStatus(403);
        req.user = userKey;
        next();
    });

}

app.listen(3000);