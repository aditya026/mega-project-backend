const User = require("../models/userModel")
const mailSender = require("../utils/mailSender")
const bcrypt = require("bcrypt")

// reset password token
exports.resetPasswordToken = async (req,res) => {
    try{
        // get email req.body
    const email = req.body.email
    // check user for this emial, email validation
    const user = await User.findOne({email: email})
    if(!user){
        return res.json({
            success: false,
            message: "your email is not registered with us"
        })
    }
    // generate token
    const token =  crypto.randomUUID()

    // updating user by adding token and expiration time
    const updateDetails = await User.findOneAndUpdate(
                                {email:email},
                                {
                                    token: token,
                                    resetPasswordExpires: Date.now() + 5*60*1000
                                },
                                {new: true})

    // create URL
    const url = `http://localhost:3000/update-password/${token}`


    // send mail containing the URL
    await mailSender(email, "password reset Link", `password reset Link ${url}`)
    
    // return response
    return res.json({
        success: true,
        message: "email send successfully, please check email  and change password"
    })


}catch(error){
        return res.status(500).json({
            success: false,
            message:"something worng with the reset password token "
        })
    }
}
// reset password
exports.resetPassword = async (req,res) => {
    try{
        // data fetch
    const {password, confirmPassword, token} = req.body
    
    // validation
    if(password !== confirmPassword){
        return res.json({
            success: false,
            message: "Password is not matching",
        })
    }
    // get user details from db using token
    const userDetails = await user.findOne({token: token})
    // if no entry - invalid token
    if(!userDetails){
         return res.json({
            success: false,
            message: "token is invalid"
         })
    }
    // token time check 
    if(userDetails.resetPasswordExpires < Date.now()){
        return res.json({
            success: false,
            message: "token is expired, please regenerate your token"
        });
    }
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    // password update
    await User.findOneAndUpdate(
        {token:token},
        {password:hashedPassword},
        {new:true},
    )
    // response return
    return res.status(200).json({
        success: true,
        message: "password reset successfull"
    })

    }catch(error){
        return res.status(500).json({
            success: false,
            message: "reset password is not done"
        })
    }
}

// last 5 min revision