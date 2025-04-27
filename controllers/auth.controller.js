/**
 * i need to write the controller / logic to register a user
 */
const bcrypt = require('bcryptjs')
const user_model = require("../models/user.model")
const jwt = require('jsonwebtoken')
const secret = require("../Config/auth.config")


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
      return  res.status(201).send(user_created) // success


    } catch (err) {
        console.log("eror while registring", err);
       return res.status(500).send({
            message: "some error happend while registering"
        })
    }


    //3) Return the response back to the user
}

//_____________________________________________________________________________________


exports.signIn = async (req, res) => {

    // check if the userId n password is correct or not
    const user = await user_model.findOne({ userId: req.body.userId })
    if (user == null) {
        return res.status(400).send({
            message: "USer id passed is not valid"
        })
    }

    const isPasswordValid = bcrypt.compareSync(req.body.password, user.password)
    if (!isPasswordValid) {
        return res.status(401).send({
            message: "wrong password !"
        })
    }


    // using jwt we will create the access tokem with a given token(TTL) nad return

    const token = jwt.sign({ id: user.userId }, secret.secret, {
        expiresIn: 120 //second
    })

    res.status(200).send({
        user: user.name,
        userId: user.userId,
        email: user.email,
        userType: user.userType,
        accessTokem: token

    })

}