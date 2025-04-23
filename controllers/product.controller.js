/**
 * controller for fetching the product
 */

const product_model = require("../models/product.model")
const category_model = require("../models/category.model")
const shop_model = require("../models/shop.model")

//________________________________________________________________________________________
exports.createProduct = async (req, res) => {
    const { image, name, description, price, categoryId, link } = req.body

    if (!categoryId) {
        return res.status(400).send({
            message: "Category ID is required"
        })
    }
    try {
        const category = await category_model.findById(categoryId)

        if (!category) {
            return res.status(400).send({
                message: "category  not found ! 😒"
            })
        }

        const shop = await shop_model.findById(category.shopId)
        if (!shop) {
            return res.status(400).send({
                message: "Shop not found  full !"
            })
        }

        if (shop.owner.toString() !== req.user._id.toString()) {
            return res.status(400).semd({
                message: "u r not Authorized to add prodcut ! man🤨"
            })
        }


        const product_data = {
            name,
            description,
            price,
            image: image || 'https://tse4.mm.bing.net/th/id/OIP.dlsFyeoIz85ZYdETpmDGpQAAAA?rs=1&pid=ImgDetMain',
            categoryId: categoryId
        }

        const createProduct = await product_model.create(product_data)

        //push

        await category_model.findByIdAndUpdate(categoryId, {
            $push: {
                products: createProduct._id
            }
        })

        const updateProduct = await category_model.findById(categoryId).populate('products')
        console.log("product aaya ki ni", updateProduct.products);


        return res.status(201).send({
            message: "product created succesfully",
            updateProduct
        })

    } catch (error) {
        console.log("error while creating the product : ", error);
        return res.status(500).send({
            message: " Internal server error"
        })

    }

}


//_______________________________________________________________________________

exports.deleteProduct = async (req, res) => {
    const productId = req.params.id
    const { categoryId } = req.body

    console.log(`deleting product ${productId} from category ${categoryId}`);

    if (!productId || !categoryId) {
        return res.status(400).send({
            message: "both r reuired !"
        })
        
    }
    // console.log("proID", productId, "catId", categoryId);
    try {
        const deleteProduct = await product_model.findByIdAndDelete(productId)
        if (!deleteProduct) {
            return res.status(400).send({
                message: "product not found"
            })
        }

        // console.log(`deleting product ${prodcutId} from shop ${categoryId}`);

        const updatecategory = await category_model.findByIdAndUpdate(categoryId, {
            $pull: { products: productId }
        }, { new: true }).populate('products')

        if (!updatecategory) {
            return res.status(400).send({
                message: "category not found !"
            })
        }

        return res.status(200).send({
            message: "product deleted n removed from the category bro !",
            updatecategory
        })

    } catch (error) {
        console.log("kuchh to locha hai product mein 🤨", error);
        return res.status(500).send({
            message: "error while deleting pro bro!"
        })

    }
}