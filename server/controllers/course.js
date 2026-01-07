const Course = require("../models/course")
const Tag = require("../models/tag")
const User = require("../models/userModel")
const { uploadImageToCloudinary } = require("../utils/imageUploader")

exports.course = async(req,res) => {
    try{

        // fetch data
        const {courseName, courseDescription, whatYourWillLearn, price, tag} = req.body

        // get thumbnail
        const thumbnail = req.files.thumbnailImage

        // validation
        if(!courseName || !courseDescription || !whatYourWillLearn || !price || !tag ){
            return res.status(400).json({
                success: false,
                message: "All fields are mendatory"
            })
        }

        // check for instructor
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId)
        console.log("instructor Details:", instructorDetails)

        if(!instructorDetails){
            return res.status(404).json({
                success: false,
                message: "instructor details is not found"
            })
        }


        // check given tag is valid or not 
        const tagDetails = await Tag.findById(tag)
        if(!tag){
            return res.status(404).json({
                success: false,
                message: "tag Details is not found in "
            })
        }

        // upload  image to coludinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME) 

        // CREATE AN ENTRY for new course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor:instructorDetails._id,
            whatYouWillLearn: whatYourWillLearn,
            price,
            tag: tagDetails._id,
            thumbnail: thumbnailImage.secure_url,
        })
        // add the new course to the user Schema of instructor
        await User.findByIdAndUpdate(
            {_id: instructorDetails._id},
            {
                $push: {
                    courses: newCourse._id
                }
            },
            {new:true},
        )

        // update the tag ka schema
        // HW

        return res.status(200).json({
            success: true,
            message: "Course created successfully.",
            data: newCourse,
        })


    }catch(error){
        return res.status(500).json({
            success: true,
            message: "soemthing went wrong"
        })
    }
}


// get all courses handler function

exports.showAllCourses = async (req, res) => {
    try{

        const allCourses = await Course.find({}, 
            {
                courseName: true,
                price: true,
                thumbnail: true,
                instructor: true,
                ratingAndReviews: true,
                studentEnrolled: true 
            },).populate("instructor").exec()
return res.status(200).json({
    success: true,
    message: "data flow successfully",
    data: allCourses
})


    }catch(error){
        return res.status(500).json({
            success: false,
            message: "something went wrong.can not fetch course data",
            error: error.message 
        })
    }

}