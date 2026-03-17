<<<<<<< Updated upstream
const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");


// Register
router.post("/register", async(req,res)=>{

try{

const {name,email,password} = req.body;

const hashedPassword = await bcrypt.hash(password,10);

const user = new User({
name,
email,
password:hashedPassword
});

await user.save();

res.json(user);

}catch(err){

res.status(500).json(err);

}

});


// Login
router.post("/login", async(req,res)=>{

const {email,password} = req.body;

const user = await User.findOne({email});

if(!user)
return res.status(404).json({message:"User not found"});

const valid = await bcrypt.compare(password,user.password);

if(!valid)
return res.status(401).json({message:"Wrong password"});

const token = jwt.sign(
{id:user._id,role:user.role},
"SECRET_KEY",
{expiresIn:"1d"}
);

res.json({token,user});

});

module.exports = router;
=======

const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");


// Register
router.post("/register", async(req,res)=>{

try{

const {name,email,password} = req.body;

const hashedPassword = await bcrypt.hash(password,10);

const user = new User({
name,
email,
password:hashedPassword
});

await user.save();

res.json(user);

}catch(err){

res.status(500).json(err);

}

});


// Login
router.post("/login", async(req,res)=>{

const {email,password} = req.body;

const user = await User.findOne({email});

if(!user)
return res.status(404).json({message:"User not found"});

const valid = await bcrypt.compare(password,user.password);

if(!valid)
return res.status(401).json({message:"Wrong password"});

const token = jwt.sign(
{id:user._id,role:user.role},
"SECRET_KEY",
{expiresIn:"1d"}
);

res.json({token,user});

});

module.exports = router;
>>>>>>> Stashed changes
