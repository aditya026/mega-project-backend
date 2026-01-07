const tag = require("../models/tag") 

// create tag  handeler function

exports.createCategory = async (req,res) => {
    try{
        // fetch data 
        const {name, discription} = req.body;

        // validation
        if(!name || !description){
            return res.status(400).json({
                success: false,
                message: "all fields are required", 
            })
        }
        // create entry in DB
        const tagDetails = await Tag.create({
            name: name,
            description: description,
        })
        console.log(tagDetails)

        // return response 
        return res.status(200).json({
            success: true,
            message: "tag created successfully"
        })

    }catch(error){
        return res.status(500).json({
            success: false,
            message: "something went wrong"
        })
    }
}


// get all tags  handeler function 
exports.showAllCategory = async (res, res) => {
    try{
        const allTags = await Tag.find({}, {name: true, decription: true})
        res.status(200).json({
            success: true,
            message: "All tags returned successfully"
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "something went wrong"
        })
    }
}