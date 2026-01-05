const jwt = require("jsonwebtoken")
require("dotenv").config()
const User = require("../models/userModel")

// auth
exports.auth = async (req,res, next) => {
    try{
        // extract token
        const token = req.cookie.token 
                || req.body.token 
                || req.header("Authorisation").replace("Bearer ", "")
        
        // if token missing, then return response 
        if(!token) {
            return res.status(401).json({
                success: false,
                message:"token is missing",
            })
        }

        // varify the token
        try{
            const decode = await jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode
        }catch(err){
            // varification issue
            return res.status(500).json({
                success: false,
                message: "token is invalid"
            })
        }
        next()

    }catch(error){
        return res.status(500).json({
                success: false,
                message: "token is invalid"
            })
    }
}

// isStudent

// isInstructor

// isAdmin