const Section = require("../models/section")
const Course = require("../models/course")

exports.createSection = async (req, res) => {
    try{

        // data fetch
        const {sectionName, courseId} = req.body
        // data validation
        if(!sectionName || !courseId) {
            return res.status(404).json({
                success: false,
                message: "fill the the fields"
            })
        }
        // create section
        const newSection = await Section.create({sectionName})
        // update course with section course id
        const updateCourse = await Course.findById(
            courseId,
            {
                $push:{
                    courseContent: newSection._id,
                }
            },
            {new: true}
        )
        // HW: use populate  to replace sections/sub section woth in the updatedCourseDetails
        // return response 
        return res.status(200).json({
            success: true,
            message: "section created successfully",
            updatedCourseDetails,
        })

    }catch(error){
        return res.status(500).json({
            success: false,
            message: "something wrong with the create section."
        })
    }
}


exports.updateSection = async (rea,res) => {
    try{

        // data input 
        const {sectionName, sectionId} = req.body;
        // data validation
        if(!sectionName || !sectionId) {
            return res.status(404).json({
                success: false,
                message: "all fields required."
            })
        }

        // update the data 
        const section = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new: true})


        // return response
        return res.status(200).json({
            success: false,
            message: "Section Updated successfully"
        })

    }catch(error){
        return res.status(500).json({
            success: false,
            message: "something wrong with the updateSection"
        })
    }
}


exports.delete = async (req, res) => {
    try{
        //  get id
        const {sectionId} = req.params
        //  findbyIdAndDelete
        await Section.findbyIdAndDelete(sectionId);
        // return response
        return res.status(200).json({
            success: true,
            message: "Section Deleted Successfully"
        })

    }catch(error){
        return res.status(500).json({
            success: false,
            message: "unable to delete the section..."
        })
    }
}