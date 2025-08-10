require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { configDotenv } = require("dotenv");
const { User, RefreshToken } = require("./models");
const app = express();
app.use(express.json());

const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

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

//fetch posts
app.get("/posts", authenticateToken, (req, res) => {
  res.json(posts.filter((post) => post.userName === req.user.name));
});

//fetch users TO BE REMOVED
app.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // exclude password field
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//register user
app.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = { name: req.body.name, password: hashedPassword };
    await User.create(user);
    res.status(201).send(user);
  } catch {
    res.status(500).send();
  }
});

//login user
app.post("/login", async (req, res) => {
  const user = await User.findOne({ name: req.body.name });
  if (user == null) {
    return res.status(400).send("Cannot find user");
  }

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const userKey = { id: user._id, name: user.name };
      const accessToken = generateAccesstoken(userKey);
      const refreshToken = jwt.sign(userKey, process.env.REFRESH_TOKEN_SECRET);
      const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
      await RefreshToken.create({
        token: hashedRefreshToken,
        userId: user._id,
      });
      res
        .status(200)
        .json({ accessToken: accessToken, refreshToken: refreshToken });
    } else {
      res.status(400).send("Invalid Credentials");
    }
  } catch {
    res.status(500).send();
  }
});

//logout user
app.delete("/logout", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.sendStatus(400);

    const decoded = jwt.decode(token);
    if (!decoded?.id) return res.sendStatus(403);
    const storedTokens = await RefreshToken.find({ userId: decoded.id });

    // Find the matching token by comparing hash
    let matchingTokenDoc = null;
    for (const doc of storedTokens) {
      const isMatch = await bcrypt.compare(token, doc.token);
      if (isMatch) {
        matchingTokenDoc = doc;
        break;
      }
    }

    if (!matchingTokenDoc) return res.sendStatus(403);

    await RefreshToken.deleteOne({ _id: matchingTokenDoc._id });
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

//post refreshToken to create new accessToken
app.post("/token", async (req, res) => {
  try {
    const { token: refreshToken } = req.body;
    if (!refreshToken) return res.sendStatus(401);

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch {
      return res.sendStatus(403);
    }
    if (!decoded?.id) return res.sendStatus(403);

    const storedTokens = await RefreshToken.find({ userId: decoded.id });

    let isValid = false;
    for (const doc of storedTokens) {
      const match = await bcrypt.compare(refreshToken, doc.token);
      if (match) {
        isValid = true;
        break;
      }
    }

    if (!isValid) return res.sendStatus(403);

    const accessToken = generateAccesstoken({
      id: decoded.id,
      name: decoded.name,
    });
    res.json({ accessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

//generate accesstoken
function generateAccesstoken(userKey) {
  return jwt.sign(userKey, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15s",
  });
}

//authenticate users
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, userKey) => {
    if (err) return res.sendStatus(403);
    req.user = userKey;
    next();
  });
}

app.listen(3000);
