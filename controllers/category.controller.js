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
        const shop = await shop_model.findById(shopId) // belongn to whom⬆️
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
            shopId: shopId
        }

        const cate_created = await cat_model.create(cat_data)

        // push

        await shop_model.findByIdAndUpdate(shopId, {
            $push: {

                categories: cate_created._id


            }
        })

        // populate
        const updatedShop = await shop_model.findById(shopId).populate('categories')
        console.log("bn rhaa hai ki ni : ",updatedShop.categories);




        return res.status(201).send(updatedShop)


    } catch (error) {
        console.log("failed boro !", error);
        return res.status(500).send({
            message: "error while creating category"
        })

    }
}

//_____________________________________________________________________

exports.deleteCategory = async (req, res) => {
    // const {categoryId, shopId} = req.body

    const categoryId = req.params.id
    const { shopId } = req.body

    if (!categoryId || !shopId) {
        return res.status(400).send({
            message: "bith r required !"
        })
    }
    try {
        const deleteCategory = await cat_model.findByIdAndDelete(categoryId)
        if (!deleteCategory) {
            return res.status(404).send({
                message: "category not found !"
            })
        }

        console.log(`Deleting category ${categoryId} from shop ${shopId}`);


        const updatedShop = await shop_model.findByIdAndUpdate(shopId, {
            $pull: { categories: categoryId }
        }, { new: true }).populate('categories')


        if (!updatedShop) {
            return res.status(400).send({
                message: "shop not found"
            })
        }

        return res.status(200).send({
            message: "category deleted n removed from the shop ! 😘",
            updatedShop
        })
    } catch (error) {
        console.log("kuchh to lochaa hai 🤨", error);
        return res.status(500).send({
            message: "error while deleting bror !"
        })

    }
}

// return the response of the created cate

