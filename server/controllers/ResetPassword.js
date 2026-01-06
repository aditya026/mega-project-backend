const User = require("../models/userModel")
const mailSender = require("../utils/mailSender")

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

// last 5 min revision