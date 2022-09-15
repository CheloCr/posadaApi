const jwt = require ("jsonwebtoken")

// This function matches the bearer header with the user's token
const verifyToken = (req,res,next) => {
    const authHeader = req.headers.token

    if(authHeader){
        const token = authHeader.split(" ")[1]
        jwt.verify(token,process.env.JWT_SEC,(error,user) => {
            if (error) return res.status(403).json("Token no valido")
            req.user = user
            next()
        })
    } else {
        return res.status(401).json("No estas autenticado")
    }
}


const verifyTokenAndPermision = (req,res,next) => {
    verifyToken(req,res, ()=> {
        if(req.user.id === req.params.id || req.user.isAdmin) {
            next()
        } else {
            res.status(403).json("Movimiento no autorizado")
        }
    })
}

// Check if the user is an administrator
const verifyTokenAdmin = (req,res,next) => {
    verifyToken(req,res, ()=> {
        if(req.user.isAdmin) {
            next()
        } else {
            res.status(403).json("Movimiento no autorizado")
        }
    })
}

module.exports = {verifyToken,verifyTokenAndPermision,verifyTokenAdmin}