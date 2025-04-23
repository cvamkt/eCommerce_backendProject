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
        console.log("bn rhaa hai ki ni : ", updatedShop.categories);




        return res.status(201).send(updatedShop)


    } catch (error) {
        console.log("failed boro !", error);
        return res.status(500).send({
            message: "error while creating category"
        })

    }
}


//________________________________________________________
exports.getMyCategory = async (req, res) => {
    try {
        const myShop = await shop_model.find({ owner: req.user._id })

        if (myShop.length === 0) {
            return res.status(404).send({
                message: "no shop found !"
            })
        }

        const shopIds = myShop.map(shop => shop._id)

        const categories = await cat_model.find({ shopId: { $in: shopIds } })

        return res.status(200).send({
            message: "categories fetched successfully",
            categories
        })
    } catch (error) {
        console.log("error fetching categories", error);
        return res.status(500).send({
            message: "internal server error while fetching categories"
        })

    }
}

//___________________________________________________________________

exports.getSingleMyCategory = async (req, res) => {
    try {
        const category = await cat_model.findById(req.params.id)

        if (!category) {
            return res.status(404).send({
                message: "phle bana tu 🤨"
            })
        }
        return res.status(200).send(category)

    } catch (error) {
        console.log("kuchh ni dala hai tu", error);
        return res.status(500).send({
            message: "error while fetching buddy !"
        })

    }
}

//_____________________________________________________________________

exports.updateCategory = async (req, res) => {
    try {
        const { name, description } = req.body

        const category = await cat_model.findById(req.params.id)

        if (!category) {
            return res.status(400).send({
                message: "category not found ok !"
            })
        }

        const shop = await shop_model.findById(category.shopId);
        if (!shop || shop.owner.toString() !== req.user._id.toString()) {
            return res.status(403).send({
                message: "you are not authorized to update this category"
            });
        }


        category.name = name || category.name;
        category.description = description || category.description;

        await category.save();

        return res.status(200).send({
            message: "category updated successfully !💕",
            category
        })

    } catch (error) {
        console.log("kaha hai category ", error);
        return res.status(500).send({
            message: "internal server error"
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
            message: "both r required !"
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

