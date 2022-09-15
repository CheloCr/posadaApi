const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require ("crypto-js")
const jwt = require("jsonwebtoken")

//todo SIGNUP
router.post("/register", async (req, res) => {


  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(req.body.password,process.env.CRYPTO_SEC).toString()
  });

  try {

    if (!req.body.username.length || !req.body.email.length || !req.body.password.length) return res.status(400).json({ errorMessage: "No debes mandar campos vacios!" });


    const savedUser = await newUser.save()
    res.status(200).json(savedUser)
  } catch (error) {
    res.status(500).json(error)
  }

  
  


});

//todo LOGIN
router.post("/login", async (req,res) => {

    const {email} = req.body

    try {
        // Find if there is no repeat email if there is one it will return an error
        const user = await User.findOne({email})
        if(!user) return res.status(401).json("Credenciales Incorrectas")
        // Match the original password with the hash password if it doesn't match it will return an error
        const hashedPassword = CryptoJS.AES.decrypt(user.password,process.env.CRYPTO_SEC)
        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8)
        originalPassword !== req.body.password && res.status(401).json("Credenciales Incorrectas")


        //JSON WEB TOKEN
        const accessToken = jwt.sign({
            id:user._id,
            isAdmin:user.isAdmin
        },process.env.JWT_SEC,{expiresIn:"24h"})

        //Remove the password from the data
        const{password,...others} = user._doc

        res.status(200).json({...others,accessToken})

    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router;
