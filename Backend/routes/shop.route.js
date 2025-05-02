/**
 * POST
 * localhost:8888/api/v1/createShop
 * localhost:8888/api/v1/getShop
 * localhost:8888/api/v1/getSingleShop
 * localhost:8888/api/v1/updateShop
 * localhost:8888/api/v1/deleteShop
 */

const shop_mw = require("../middlewares/auth.middleware")
const shop_Controller = require("../controllers/shop.controller")


module.exports = (app) => {
    app.post("/api/v1/createShop", [shop_mw.verifyToken, shop_mw.isAdmin], shop_Controller.createShop)
    app.get("/api/v1/getShop", [shop_mw.verifyToken, shop_mw.isAdmin], shop_Controller.getMyShop)
    app.get("/api/v1/getSingleShop/:id", [shop_mw.verifyToken, shop_mw.isAdmin], shop_Controller.getSingleMyShop)
    app.put("/api/v1/updateShop/:id", [shop_mw.verifyToken, shop_mw.isAdmin], shop_Controller.updateShop)
    app.delete("/api/v1/deleteShop/:id", [shop_mw.verifyToken, shop_mw.isAdmin], shop_Controller.deleteShop)
}