/**
 * localhost:8888/api/v1/createProduct
 * localhost:8888/api/v1/deleteProduct
 */

const productController = require("../controllers/product.controller")
const auth_mw = require("../middlewares/auth.middleware")

module.exports = (app) => {
    app.post("/api/v1/createProduct", [auth_mw.verifyToken, auth_mw.isAdmin], productController.createProduct)
    app.delete("/api/v1/deleteProduct/:id", [auth_mw.verifyToken, auth_mw.isAdmin], productController.deleteProduct)
}