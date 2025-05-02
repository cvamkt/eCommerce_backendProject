/**
 * this is the starting file of the project
 */
require("dotenv").config()
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const server_config = require("./Config/server.config")
const db_config = require("./Config/db.config")
const user_model = require("./models/user.model")
const bcrypt = require("bcryptjs")

app.use(express.json())



/**]
 * create an admin user at  the starting of the application
 * if not already present
 */


// connection to mongoDB compass
mongoose.connect(db_config.DB_URL)
const db = mongoose.connection

db.on("error", () => {
    console.log("error while connection to the mongoDB");

})
db.once("open", () => {
    console.log("connected to mongoDB");
    init()

})

async function init() {
    try {
        let user = await user_model.findOne({ userId: "admin" })
        if (user) {
            console.log("Admin is already present");
            return

        }

    } catch (err) {
        console.log("error while reading the data", err);

    }

    try {
        user = await user_model.create({
            name: "saka",
            userId: "admin",
            email: "ritu321@gmail.com",
            userType: "ADMIN",
            password: bcrypt.hashSync("welcome@321", 8)
        })

        console.log("Admin created", user);

    } catch (error) {
        console.log("error while creatinga admin", error);

    }
}
/**
 * switch the route to server
 */


require("./routes/auth.route")(app)
require("./routes/category.route")(app)
require("./routes/shop.route")(app)
require("./routes/product.route")(app)
require("./routes/rating.route")(app)
require("./routes/payment.route")(app)


app.use('/uploads', express.static('uploads'))




/**
 * start the server
 */

app.listen(server_config.PORT, () => {
    console.log("server started AT PORT number : ", server_config.PORT);

})