/**
 * create a middleware which check if the req body is proper and correct 
 */

const user_model = require("../models/user.model")

const verifySignUpBody = async (req, res, next) => {

    try {
        //check for the name
        if (!req.body.name) {
            return res.status(400).send({
                message: "Failed : Name was not provided in request body"
            })
        }

        //check for the mail
        if (!req.body.email) {
            return res.status(400).send({
                message: "Failed ! Email  was not provided in the request body"
            })
        }

        // check for the userID
        if (!req.body.userId) {
            return res.status(400).send({
                message: "Failed ! userId was not provided in the request body"
            })
        }

        //check if the user with same userId is already exits 
        const user = await user_model.findOne({ userId: req.body.userId })
        if (user) {
            return res.status(400).send({
                message: "Failed ! same userId is already exits"
            })
        }


    } catch (error) {

        console.log("error while validating the request object", error)
        res.status(500).send({
            message: "Error while validating the request body"
        })

    }
}


module.exports = {
    verifySignUpBody: verifySignUpBody
}