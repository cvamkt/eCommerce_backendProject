
const product_model = require("../models/product.model")
const rating_model = require("../models/rating.model")
const user_model = require("../models/user.model")
const { updateProduct } = require("./product.controller")
const mongoose = require("mongoose")

//__________________________________
exports.createRating = async (req, res) => {
    const { productId, userId, rating, review } = req.body

    if (!productId && !userId) {
        return res.status(400).send({
            message: "productId n UserId both needed man! 🤨"
        })
    }

    try {

        // as it expect objectId but i'm giving userId so i have to convert it

        const userObjectId = mongoose.Types.ObjectId.isValid(userId) ? userId : null;

        if (!userObjectId) {
            return res.status(400).send({
                message: " invalid userId"
            })
        }

        const product = await product_model.findById(productId)

        if (!product) {
            return res.status(400).send({
                message: "no pruduct here buddy !"
            })
        }

        const user = await user_model.findById(userId)

        if (!user) {
            return res.status(400).send({
                message: "no user found !"
            })
        }

        const existingRating = await rating_model.findOne({ productId, userId })

        if (existingRating) {
            return res.status(400).send({
                message: "u already rated this product bro !"
            })
        }

        const rating_data = {
            productId,
            userId: user._id,
            rating,
            review
        }

        const createRating = await rating_model.create(rating_data)

        //push to product

        await product_model.findByIdAndUpdate(productId, {
            $push: {
                rating: {
                    _id: createRating._id,
                    userId: user._id,
                    name: user.name,
                    rating: createRating.rating,
                    review: createRating.review


                }
            }
        })



        return res.status(200).send({
            message: "rated the product succesfully",
            createRating
        })



    } catch (error) {
        console.log("error while creating the rating", error);
        return res.status(500).send({
            message: " Internal server error"
        })

    }
}


//_____________________________________________________________

exports.deleteRating = async (req, res) => {
    const ratingId = req.params.id
    const { userId } = req.body
    const { productId } = req.body
    console.log("RATING_ID", ratingId);


    console.log(`deleting rating's productID ${productId} from user ${userId}`);

    if (!productId || !userId) {
        return res.status(400).send({
            message: "both r required !"
        })
    }
    try {
        // const deleteRating = await rating_model.findByIdAndDelete(ratingId)

        // if (!deleteRating) {
        //     return res.status(400).send({
        //         message: "rating not found ! first rate it man"
        //     })
        // }

        // const updateProduct = await product_model.findByIdAndUpdate(productId, {
        //     $pull: {
        //         rating: { _id: ratingId }
        //     }
        // }, { new: true }).populate('rating')

        // if (!updateProduct) {
        //     return res.status(400).send({
        //         message: "no any product!"
        //     })
        // }

        // if (!updateProduct.rating.some(rating => rating._id.toString() === ratingId)) {
        //     return res.status(400).send({
        //         message: "rating not found in product's rating array"
        //     });
        // }


        const product = await product_model.findById(productId)

        if (!product) {
            return res.status(400).send({
                message: "product not found"
            })
        }

        const ratingIndex = product.rating.findIndex(rating => rating._id.toString() === ratingId)
        console.log("kitna hai", ratingIndex);


        if (ratingIndex === -1) {
            return res.status(400).send({
                message: "Rating not found in the product's rating!"
            })
        }

        if (product.rating[ratingIndex].userId.toString() !== userId) {
            return res.status(403).send({
                message: "u can't delete a rating u didn't submit"
            })
        }


        const deleteRating = await rating_model.findByIdAndDelete(ratingId)

        if (!deleteRating) {
            return res.status(400).send({
                message: "rating not found ! first rate it man"
            })
        }


        await product_model.findByIdAndUpdate(productId, {
            $pull: {
                rating: { _id: ratingId }
            }
        }, { new: true }).populate('rating')

        return res.status(200).send({
            message: "rating deleted successfully n product updated!",
            updateProduct: product
        })

    } catch (error) {
        console.log("error while deleting the rating", error);
        return res.status(500).send({
            message: "Internal server error"
        })

    }

}


//_______________________________________________________________
exports.getAllRating = async (req, res) => {
    const userId = req.user._id
    console.log("USER = ", userId);


    if (!userId) {
        return res.status(400).send({
            message: "user not found !"
        })
    }
    try {
        const rating = await rating_model.find({ userId: userId })
        if (rating.length === 0) {
            return res.status(400).send({
                message: "no rating rated here man 🤨"
            })
        }

        return res.status(200).send({
            message: "all rating feteched successfully",
            rating: rating
        })
    } catch (error) {
        console.log("kuchh to locha hai ", error);
        return res.status(500).send({
            message: "Internal server error"
        })

    }
}

//__________________________________________________________________
exports.getEachRating = async (req, res) => {
    // try {
    //     const rating = await rating_model.findById(req.params.id)

    //     if (!rating) {
    //         return res.status(400).send({
    //             message: "first rate it bror (●'◡'●)"
    //         })
    //     }

    //     return res.status(200).send(rating)
    // } catch (error) {
    //     console.log("ni mila", error);
    //     return res.status(500).send({
    //         message: "Internal server error"
    //     })

    // }

    const { productId } = req.params

    try {
        const rating = await rating_model.find({ productId: productId })

        if (rating === 0) {
            return res.status(400).send({
                message: "no rating found in this product !"
            })

        }
        return res.status(200).send({
            message: "Rating fetched successfully",
            rating: rating
        })
    } catch (error) {
        console.log("error in fetching the rating", error);
        return res.status(500).send({
            message: "Internal serve error"
        })

    }
}


//________________________________________________________________________
exports.updateRating = async (req, res) => {
    try {
        const { rating, review } = req.body
        const ratings = await rating_model.findById(req.params.id)

        if (!ratings) {
            return res.status(400).send({
                message: "no rating submitted here !"
            })
        }
        ratings.rating = rating || ratings.rating
        ratings.review = review || ratings.review

        await ratings.save()

//update in linked schema
        await product_model.findByIdAndUpdate(ratings.productId, {
            $set: {
                "rating.$[elem].rating": ratings.rating,
                "rating.$[elem].review": ratings.review
            }
        }, {
            arrayFilters: [{ "elem.userId": ratings.userId }],
            new: true
        });

        return res.status(200).send({
            message: "rating updated successfully",
            ratings: ratings
        })


    } catch (error) {
        console.log("not updated", error);
        return res.status(500).send({
            message: "Internal server Error"
        })

    }
}
