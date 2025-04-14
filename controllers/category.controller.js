/**
 * controller for creating the category
 * 
 */

const cat_model = require("../models/category.model")
const shop_model = require("../models/shop.model")


exports.createNewCategory = async (req, res) => {

    const { name, description, shopId } = req.body

    if (!shopId) {
        return res.status(400).send({
            message: "shop ID is reuired"
        })
    }
    try {
        const shop = shop_model.findById(shopId) // belongn to whom⬆️
        if (!shop) {
            return res.status(404).send({
                message: "Shop not found bro !"
            })
        }
        if (shop.owner.toString() !== req.user._id.toString()) {
            return res.status(403).send({
                message: "You are not authorized to add categories to this shop"
            })
        }

        // category objjjj

        const cat_data = {
            name,
            description,
            shop: shopId
        }

        const cate_created = await cat_model(cat_data)

        return res.status(201).send(cate_created)


    } catch (error) {
        console.log("failed boro !", error);
        return res.status(500).send({
            message: "error while creating category"
        })

    }
}

// return the response of the created cate

