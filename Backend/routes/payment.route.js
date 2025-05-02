/**
 *  localhost:8888/api/v1/createOnLinePayment
 * localhost:8888/api/v1/verifyPayment
 * localhost:8888/api/v1/codPayment
 * localhost:8888/api/v1/deleteProduct
 */

const payController = require("../controllers/payemnt.controller")
const pay_mw = require("../middlewares/auth.middleware")

module.exports = (app) =>{
    app.post("/api/v1/createOnLinePayment",[pay_mw.verifyToken,pay_mw.user],payController.createOnlineOrder)
    app.post("/api/v1/verifyPayment",payController.verifyPayment)
    app.post("/api/v1/codPayment", payController.createCOD)
}