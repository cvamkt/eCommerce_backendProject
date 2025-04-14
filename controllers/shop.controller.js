// const shopModel = require("../models/shop.model")
const shop_model = require("../models/shop.model")


exports.createShop = async (req, res) => {


    // ceate obj

    const shop_data = {
        name: req.body.name,
        description: req.body.description,
        owner: req.user._id,
        categories: []
    }


    try {
        const shop_created = await shop_model.create(shop_data)
        // populate
        const populateShop = await shop_model.findById(shop_created._id).populate('categories')
        res.status(201).send(populateShop)

    } catch (error) {
        console.log("failed ho gya bhai", error);
        res.status(500).send({
            message: "error while creating shops"
        })

    }
}

//________________________________

exports.getMyShop = async (req, res) => {


    try {

        const myShop = await shop_model.find({ owner: req.user._id })

        if (myShop.length === 0) {
            return res.status(400).send({
                message: "No shop found for this admin"
            })
        }
        res.status(200).send(myShop);

    } catch (error) {
        console.log("Failed to fetch the shop", error);
        res.status(500).send({
            message: "error while fecthing shops"
        })

    }
}

//__________________________________________


exports.getSingleMyShop = async (req, res) => {
    try {
        const shop = await shop_model.findById(req.params.id)

        if (!shop) {
            return res.status(404).send({
                message: "pahle kama ke aaa !"
            })
        }

        if (shop.owner.toString() !== req.user._id.toString()) {
            return res.status(403).send({
                message: "how dare u🤨"
            })
        }
        return res.status(200).send(shop)

    } catch (err) {
        console.log("ni hai koi tera dukan ! 🤣", err);
        return res.status(500).send({
            message: " error while shop buddy !"
        })

    }
}


//_________________________________________________________________________

exports.updateShop = async (req, res) => {
    try {
        const { name, description, categories } = req.body
        const shopId = req.params.id

        const shop = await shop_model.findById(shopId)

        if (!shop) {
            return res.status(404).send({
                message: "shop not found bro"
            })
        }

        if (shop.owner.toString() !== req.user._id.toString()) {
            return res.status(403).send({
                message: " you r not authorized to update this shop"
            })
        }

        shop.name = name || shop.name;
        shop.description = description || shop.description;
        shop.categories = categories || shop.categories;

        await shop.save();

        return res.status(200).send({
            message: "shop updated successfully",
            shop
        })



    } catch (error) {
        console.log("failed to update bro ! 😭", error);
        res.status(500).send({
            message: "Error while updating shop"
        })

    }
}


//__________________________________________


exports.deleteShop = async (req, res) => {
    try {
        const shop = await shop_model.findById(req.params.id)

        if (!shop) {
            return res.status(404).send({
                message: "no shop here u fool😒"
            })

        }
        if (shop.owner.toString() !== req.user._id.toString()) {
            return res.status(403).send({
                message: "HOW DARE U 🤨"
            })
        }

        const deleted = await shop_model.findByIdAndDelete(req.params.id)

        return res.status(200).send({
            deleted,
            message: "deletd ur shop now chill ! 😉"
        })




    } catch (error) {
        console.log("check properly bro ! 😒", error);
        return res.send({
            message: "error while deleting the shop"
        })

    }
}