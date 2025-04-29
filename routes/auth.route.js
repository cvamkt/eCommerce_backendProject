 /**
  * POST localhost:8888/api/v1/auth/signup
  * POST localhost:8888/api/v1/auth/signIn
  * PUT localhost:8888/api/v1/auth/resetPassword
  * POS localhost:8888/api/v1/auth/forgetPassword
  * POS localhost:8888/api/v1/auth/forResPassword
  */

 const authController = require("../controllers/auth.controller")
 const authMiddleware = require("../middlewares/auth.middleware")

 module.exports = (app)=>{
    app.post("/api/v1/auth/signup",[authMiddleware.verifySignUpBody], authController.signup)
    app.post("/api/v1/auth/signIn",[authMiddleware.verifySignInBody],authController.signIn)
    app.put("/api/v1/auth/resetPassword",authMiddleware.verifyToken,authController.resetPassword)
    app.post("/api/v1/auth/forgetPassword",authMiddleware.verifyToken,authController.forgetPassword)
    app.post("/api/v1/auth/forResPassword",authMiddleware.verifyToken,authController.verifyOtpAndResetPassword)
 }



