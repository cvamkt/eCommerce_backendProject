/**
 * POST 
 * localhost:8888/api/v1/categories
 */

const categoriesController = require("../controllers/category.controller")
const  auth_mw = require("../middlewares/auth.middleware")
module.exports = (app)=>{
    app.post("/api/v1/categories",[auth_mw.verifyToken, auth_mw.isAdmin],categoriesController.createNewCategory)
}