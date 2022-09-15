const User = require("../models/User")
const { verifyToken,verifyTokenAndPermision,verifyTokenAdmin } = require("./verifyToken")
const CryptoJS = require("crypto-js")

const router = require("express").Router()


//todo UPDATE
router.put("/:id",verifyTokenAndPermision, async (req,res) => {

    if(req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password,process.env.CRYPTO_SEC).toString()
    }
    
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        },{new:true})

        res.status(200).json(updatedUser)
    } catch (error) {
        res.status(500).json(error)
    }
})


//todo DELETE
router.delete("/:id",verifyTokenAndPermision, async (req,res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("Usuario eliminado")
    } catch (error) {
        res.status(500).json(error)
    }
})


//todo GET USER (JUST ADMIN) 
router.get("/find/:id",verifyTokenAdmin, async (req,res) => {
    try {
        const selectedUser = await User.findById(req.params.id)
        const{password,...others} = selectedUser._doc

        res.status(200).json(others)
    } catch (error) {
        res.status(500).json(error)
    }
})


//todo GET ALL USERS (JUST ADMIN) 
router.get("/",verifyTokenAdmin, async (req,res) => {
    
    const query = req.query.new // ==> ?new=true

    try {
        const allUsers = query ? await User.find().sort({_id: -1}).limit(5) : await User.find()


        res.status(200).json(allUsers)
    } catch (error) {
        res.status(500).json(error)
    }
})


//todo TOTAL USERS PER MONTH (JUST ADMIN) 
router.get("/stats",verifyTokenAdmin, async (req,res) =>  {
    const date = new Date()
    const lastYear = new Date(date.setFullYear(date.getFullYear() -1)) // will return the last year data

    try {
        
        const data = await User.aggregate([
            { $match : { createdAt: {$gte : lastYear} } },
            {
                $project: {
                    month: { $month : "$createdAt"}
                }
            },
            {
                $group : {
                    _id: "$month",
                    total: {$sum : 1}
                }
            }
        ])
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router