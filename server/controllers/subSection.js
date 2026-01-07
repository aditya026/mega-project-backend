const SubSection = require("../models/subSection")
const Section = require("../models/section")
const { uploadImageToCloudinary } = require("../utils/imageUploader")
const subSection = require("../models/subSection")


exports.createSubSection = async (req, res) => {
    try{
        // fetch the data
        const {sectionId, title, timeDuration, description} = req. body

        // extract video/file
        const video = req.files.videoFile
        // validation
        if(!sectionId || !title || !timeDuration || !description || !video) {
            return res.status(404).json({
                success: false,
                message: "all fields required"
            })
        }
        // upload video to couldinary
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME)
        // create a subsection
        const subSectionDetails = await subSection.create({
            title: title,
            timeDuration: timeDuration,
            description: description,
            videoUrl: uploadDetails.secure_url,
        })
        // update the section with this sub section objectId
        const updateSection = await Section.findByIdAndUpdate({_id: sectionId},
                                                {$push: {
                                                        subsection: subSectionDetails._id
                                                    }})
        // log upadted section here, after updating populate query
        // return response
        return res.status(200).json({
            success: true,
            message: " section successfully created"
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "unable to create a subSection",
            error: error.message
        })
    }
}