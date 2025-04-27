const mongoose = require('mongoose')


const ratingSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    review: {
        type: String
    }

}, { timestamps: true, versionKey: false })

module.exports = mongoose.model("rating", ratingSchema)