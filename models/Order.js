const mongoose = require("mongoose")



const OrderSchema = new mongoose.Schema (
    {
        userId:{
            type:String,
            required:true
        },
        products:[
            {
               productId:{
                type:String
               },
                quantity:{
                    type:Number,
                    default:1
                }
            }
        ],
        amount:{
            type:Number,
            required:true
        },
        address:{
            type:Object, // Stripe will return an object
            required:true
        },
        status:{
            type:String, // Stripe will return an object
            default:"pending"
        }
    },
    {timestamps:true}
)

module.exports = mongoose.model("Order",OrderSchema)