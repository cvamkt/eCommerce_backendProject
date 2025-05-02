/**
 * controller for fetching the product
 */

const product_model = require("../models/product.model")
const category_model = require("../models/category.model")
const shop_model = require("../models/shop.model")
// const product = require("../models/product.model")

//________________________________________________________________________________________
exports.createProduct = async (req, res) => {
    const { image, name, description, price, categoryId, link } = req.body

    let imageUrl = req.body.image = req.body.image

    if (req.file) {
        imageUrl = `${req.protocol}: //${req.get('host')}/uploads/${req.file.filename}`
    }

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
            return res.status(400).send({
                message: "u r not Authorized to add prodcut ! man🤨"
            })
        }


        const product_data = {
            name,
            description,
            price,
            image: image || 'https://tse4.mm.bing.net/th/id/OIP.dlsFyeoIz85ZYdETpmDGpQAAAA?rs=1&pid=ImgDetMain',
            categoryId: categoryId,
            link
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
//___________________________________________________________________________________

exports.getAllProducts = async (req, res) => {
    const category = req.params.id;
    console.log("id de", category);

    if (!category) {
        return res.status(400).send({
            message: "Category ID is required"
        })
    }
    try {

        const products = await product_model.find({ categoryId: category })

        if (products.length === 0) {
            return res.status(404).send({
                message: "No Product found in this category"
            })
        }


        return res.status(200).send({
            message: "products fetched successfully",
            products
        })

    } catch (error) {
        console.log("ni aaya products", error);
        return res.status(500).send({
            message: "internal server error"
        })

    }
}


//__________________________________________________________

exports.getSingleProduct = async (req, res) => {
    try {
        const product = await product_model.findById(req.params.id)

        if (!product) {
            return res.status(400).send({
                message: " no any product here !"
            })
        }
        return res.status(200).send(product)
    } catch (error) {
        console.log("ni mila ree product", error);
        return res.status(500).send({
            message: "error while fetching products buddy !"
        })

    }
}

//____________________________________________________

exports.updateProduct = async (req, res) => {
    try {
        const { image, name, description, price, categoryId, link } = req.body

        const product = await product_model.findById(req.params.id)

        if (!product) {
            return res.status(400).send({
                message: "product nit found boro !"
            })
        }

        product.image = image || product.image
        product.name = name || product.name
        product.description = description || product.description
        product.price = price || product.price
        product.categoryId = categoryId || product.categoryId
        product.link = link || product.link

        await product.save();

        return res.status(200).send({
            message: "updated ur product succesfully boro!",
            product
        })
    } catch (error) {
        console.log("kuchh to chhora h yaa kuchh boro", error);
        return res.status(500).send({
            message: "Internal server error"
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