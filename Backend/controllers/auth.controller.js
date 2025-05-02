/**
 * i need to write the controller / logic to register a user
 */
const bcrypt = require('bcryptjs')
const user_model = require("../models/user.model")
const jwt = require('jsonwebtoken')
const secret = require("../Config/auth.config")
const crypto = require("crypto")
// const nodemailer = require("nodemailer")
const { sendEmail } = require("../utils/sendEmail")



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
        return res.status(201).send(user_created) // success


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

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password)
    if (!isPasswordValid) {
        return res.status(401).send({
            message: "wrong password !"
        })
    }


    // using jwt we will create the access tokem with a given token(TTL) nad return

    const token = jwt.sign({ id: user.userId }, secret.secret, {
        expiresIn: 3600 //second
    })

    res.status(200).send({
        user: user.name,
        userId: user.userId,
        email: user.email,
        userType: user.userType,
        accessTokem: token

    })

}

//____________________________________________________________

exports.resetPassword = async (req, res) => {
    try {
        const userId = req.user._id

        const { oldPassword, newPassword } = req.body

        const user = await user_model.findById(userId)

        if (!user) {
            return res.status(400).send({
                message: "user not found"
            })
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password)
        if (!isMatch) {
            return res.status(400).send({
                message: "old password is incorrect bro !"
            })
        }

        const salt = await bcrypt.genSalt(10)

        const hashedPass = await bcrypt.hash(newPassword, salt)

        user.password = hashedPass

        await user.save()

        return res.status(200).send({
            message: "password reset successfully"
        })
    } catch (error) {
        console.log("reset password error", error);
        return res.status(500).send({
            message: "Internal server error in password reseting"
        })

    }
}

//____________________________________________________________________________

exports.forgetPassword = async (req, res) => {
    const { email } = req.body
    const user = await user_model.findOne({ email })

    if (!user) {
        return res.status(400).send({
            message: "no user found with this email"
        })
    }

    // otp

    const otp = crypto.randomInt(100000, 999999).toString()

    user.resetPasswordOtp = otp
    user.resetPasswordOtpExpiration = Date.now() + 5 * 60 * 1000

    await user.save()

    // send otp via mail
    await sendEmail(
        user.email,
        "password Reset OTP",
        `Your OTP for password reset is : ${otp}. It is valid for 5 minutes`
    )

    res.status(200).send({
        message: "OTP sent to your registered email"
    })

}



//_____________________________________________________________________


exports.verifyOtpAndResetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    const user = await user_model.findOne({ email })

    if (!user || user.resetPasswordOtp !== otp || Date.now() > user.resetPasswordOtpExpiration) {
        return res.status(400).send({
            message: "Invalid or expired OTP"
        })
    }
    const hashedPass = await bcrypt.hash(newPassword, 10)

    user.password = hashedPass
    user.resetPasswordOtp = null
    user.resetPasswordOtpExpiration = null

    await user.save()

    res.status(200).send({
        message: "password reset successfully"
    })

}


//_____________________________________________________________________

exports.updateUserRole = async (req, res) => {
    try {
        const { userId, newRole } = req.body

        const validRoles = ['CUSTOMER', 'ADMIN']

        if (!validRoles.includes(newRole)) {
            return res.status(400).send({
                message: "Inavlid role man!"
            })
        }

        const user = await user_model.findById(userId)

        if (!user) {
            return res.status(404).send({
                message: "User not found !"
            })
        }

        user.userType = newRole;
        await user.save()

        return res.status(200).send({
            message: `user role updated successfully to ${newRole}`
        })
    } catch (error) {
        console.log("error while upadting", error);
        return res.status(500).send({
            message: "Server error"
        })

    }
}