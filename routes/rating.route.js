
/**
 * 
 * localhost:8888/api/v1/createRating
 * localhost:8888/api/v1/deleteRating
 * localhost:8888/api/v1/getAllRating
 * localhost:8888/api/v1/getEachRating/:productId
 * localhost:8888/api/v1/updateRating
 */
const rate_controller = require("../controllers/rating.controller")
const rate_mw = require("../middlewares/auth.middleware")

module.exports=(app)=>{
    app.post("/api/v1/createRating",[rate_mw.verifyToken, rate_mw.user],rate_controller.createRating)
    app.delete("/api/v1/deleteRating/:id",[rate_mw.verifyToken, rate_mw.user], rate_controller.deleteRating)
    app.get("/api/v1/getAllRating",[rate_mw.verifyToken,rate_mw.user],rate_controller.getAllRating)
    app.get("/api/v1/getEachRating/:productId",[rate_mw.verifyToken,rate_mw.user],rate_controller.getEachRating)
    app.put("/api/v1/updateRating/:id",[rate_mw.verifyToken,rate_mw.user],rate_controller.updateRating)
}