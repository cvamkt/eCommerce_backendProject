/**
 * i need to write the controller / logic to register a user
 */
const bcrypt = require('bcryptjs')
const user_model = require("../models/user.model")


exports.signup = async (req, res) => {
    /**
     * here we will write the logic
     */

    //1) read the request body
    const request_body = req.body


    //2) insert the data in the User collection in MongoDB
    const userObj = {
        name: request_body.name,
        userId: request_body.userId,
        email: request_body.email,
        userType: request_body.userType,
        password: bcrypt.hashSync(request_body.password, 8)

    }
    try {
        const user_created = await user_model.create(userObj)
        /**
         * return this user
         */
        res.status(201).send(user_created) // success


    } catch (err) {
        console.log("eror while registring", err);
        res.status(500).send({
            message: "some error happend while registering"
        })
    }


    //3) Return the response back to the user
}