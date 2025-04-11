 /**
  * POST localhost:8888/api/v1/auth/signup
  */

 const authController = require("../controllers/auth.controller")

 module.exports = (app)=>{
    app.post("/api/v1/auth/signup", authController.signup)
 }