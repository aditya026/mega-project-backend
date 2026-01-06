const Course = require("../models/course")
const Tag = require("../models/tag")
const User = require("../models/userModel")
const { uploadImageToCloudinary } = require("../utils/imageUploader")

exports.course = async(req,res) => {
    try{

        // 

    }catch(error){
        return res.status(500).json({
            success: true,
            message: "soemthing went wrong"
        })
    }
}