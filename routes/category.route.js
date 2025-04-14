/**
 * POST 
 * localhost:8888/api/v1/createcategories
 * localhost:8888/api/v1/deleteCategory
 */

const categoriesController = require("../controllers/category.controller")
const  auth_mw = require("../middlewares/auth.middleware")
module.exports = (app)=>{
    app.post("/api/v1/createCategories",[auth_mw.verifyToken, auth_mw.isAdmin],categoriesController.createNewCategory)
    app.delete("/api/v1/deleteCategory/:id",[auth_mw.verifyToken, auth_mw.isAdmin],categoriesController.deleteCategory)
}