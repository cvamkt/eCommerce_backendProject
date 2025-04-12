 /**
  * POST localhost:8888/api/v1/auth/signup
  */

 const authController = require("../controllers/auth.controller")
 const authMiddleware = require("../middlewares/auth.middleware")

 module.exports = (app)=>{
    app.post("/api/v1/auth/signup",[authMiddleware.verifySignUpBody], authController.signup)


    
    /**
     * route for
     * POST localhost:8888/api/v1/auth/signIn
     */

    app.post("/api/v1/auth/signIn",authController.signIn)
 }



