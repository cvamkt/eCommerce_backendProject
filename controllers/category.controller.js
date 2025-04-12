/**
 * controller for creating the category
 * 
 */

const cat_model = require("../models/category.model")


exports.createNewCategory = async (req, res) => {


    // read the req body


    //create into category obj
    const cat_data = {
        name: req.body.name,
        description: req.body.description


    }

    try {
        // insert into mongoDb
        const cate_created = await cat_model.create(cat_data)
        return res.status(201).send(cate_created)

    } catch (error) {
        console.log("failed !.....", error);
        return res.status(500).send({
            message: "Error while creating the category"
        })

    }


    // return the response of the created category


}