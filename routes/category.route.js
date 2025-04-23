/**
 * POST 
 * localhost:8888/api/v1/createcategories
 * localhost:8888/api/v1/getCategory
 * localhost:8888/api/v1/getSingleCategory
 * localhost:8888/api/v1/updateCategroy
 * localhost:8888/api/v1/deleteCategoryy
 */

const categoriesController = require("../controllers/category.controller")
const auth_mw = require("../middlewares/auth.middleware")
module.exports = (app) => {
    app.post("/api/v1/createCategories", [auth_mw.verifyToken, auth_mw.isAdmin], categoriesController.createNewCategory)
    app.get("/api/v1/getCategory", [auth_mw.verifyToken, auth_mw.isAdmin], categoriesController.getMyCategory)
    app.get("/api/v1/getSingleCategory/:id", [auth_mw.verifyToken, auth_mw.isAdmin], categoriesController.getSingleMyCategory)
    app.put("/api/v1/updateCategroy/:id", [auth_mw.verifyToken, auth_mw.isAdmin], categoriesController.updateCategory)
    app.delete("/api/v1/deleteCategory/:id", [auth_mw.verifyToken, auth_mw.isAdmin], categoriesController.deleteCategory)
}