const mongoose = require("mongoose")



const ProductSchema = new mongoose.Schema (
    {
        title:{
            type:String,
            required:true,
            unique:true
        },
        description:{
            type:String,
            required:true,
        },
        img:{
            type:String,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        categories:{
            type:Array,
        },
    },
    {timestamps:true}
)

module.exports = mongoose.model("Product",ProductSchema)