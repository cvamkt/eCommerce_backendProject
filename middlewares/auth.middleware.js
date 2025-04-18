/**
 * create a middleware which check if the req body is proper and correct 
 */

const user_model = require("../models/user.model")
const jwt = require('jsonwebtoken')
const auth_config = require("../Config/auth.config")





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
// signin___________________________________________________________________


const verifySignInBody = async (req, res, next) => {
    if (!req.body.userId) {
        return res.status(400).send({
            message: "userId is not valid"
        })
    }

    if (!req.body.password) {
        return res.status(400).send({
            message: "password is not provided"
        })
    }

    next()
}


// category

const verifyToken = async (req, res, next) => {

    // check if the token is present in the header
    const token = req.headers['x-access-token']

    if (!token) {
        return res.status(403).send({
            message: "No token found : UnAuthorized"
        })
    }



    // if it is a valid token
    jwt.verify(token, auth_config.secret, async (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "UnAuthorized !"
            })
        }

        const user = await user_model.findOne({ userId: decoded.id })
        if (!user) {
            return res.status(400).send({
                message: "UnAuthorized, this user for this token doesn't exit"
            })
        }

        // set the user info in the req body

        req.user = user
        next()
    })



    // then move to the next step
}



const isAdmin = (req, res, next) => {
    const user = req.user

    if (user && user.userType === "ADMIN") {
        next()
    } else {
        return res.status(403).send({
            message: "only admin can do it not u FOOL !"
        })
    }
}



module.exports = {
    verifySignUpBody: verifySignUpBody,
    verifySignInBody: verifySignInBody,
    verifyToken: verifyToken,
    isAdmin: isAdmin
}