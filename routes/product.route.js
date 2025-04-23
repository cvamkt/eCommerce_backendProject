/**
 * localhost:8888/api/v1/createProduct
 * localhost:8888/api/v1/getALLProduct
 * localhost:8888/api/v1/getSingleProduct
 * localhost:8888/api/v1/updateProduct
 * localhost:8888/api/v1/deleteProduct
 */

const productController = require("../controllers/product.controller")
const auth_mw = require("../middlewares/auth.middleware")
const upload = require("../middlewares/upload.middleware")

module.exports = (app) => {
    app.post("/api/v1/createProduct", [auth_mw.verifyToken, auth_mw.isAdmin, upload.single('image')], productController.createProduct)
    app.get("/api/v1/getALLProduct/", [auth_mw.verifyToken, auth_mw.isAdmin], productController.getAllProducts)
    app.get("/api/v1/getSingleProduct/:id", [auth_mw.verifyToken, auth_mw.isAdmin], productController.getSingleProduct)
    app.put("/api/v1/updateProduct/:id", [auth_mw.verifyToken, auth_mw.isAdmin,upload.single('image')], productController.updateProduct)
    app.delete("/api/v1/deleteProduct/:id", [auth_mw.verifyToken, auth_mw.isAdmin], productController.deleteProduct)
}