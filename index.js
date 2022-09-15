//DEPLOY EN HEROKU
const path = require("path");
//DEPLOY EN HEROKU
const favicon = require("serve-favicon");

const express = require("express")
const app = express()
const mongoose = require ("mongoose")
const dotenv = require("dotenv")

const userRoute = require("./routes/user")
const authRoute = require("./routes/auth")
const productsRoute = require("./routes/product")
const cartRoute = require("./routes/cart")
const orderRoute = require("./routes/order")




dotenv.config()

//DEPLOY EN HEROKU
app.use(express.static(path.join(__dirname, "..", "public")));
//DEPLOY EN HEROKU
app.use(
  favicon(path.join(__dirname, "..", "public", "images", "favicon.ico"))
);




//todo -------------- DV CONNECTION --------------

mongoose.connect(process.env.MONGO_URL)
.then(()=> console.log("DATA BASE CONNECTED!!!!"))
.catch((error) => console.log(error))



app.use(express.json())


//todo -------------- ENDPOINTS --------------

app.use("/api/auth",authRoute)
app.use("/api/users",userRoute)
app.use("/api/products",productsRoute)
app.use("/api/carrts",cartRoute)
app.use("/api/orders",orderRoute)

//DEPLOY EN HEROKU
app.use("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });

//todo -------------- SERVER --------------

app.listen(process.env.PORT || 5000 ,()=>{
    console.log("Corriendo el Backend")
})


//DEPLOY EN HEROKU
//Se añadió un yard add bilud