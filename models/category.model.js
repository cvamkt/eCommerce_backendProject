/**
 * name,
 * decsription
 */

const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop",
        required: true
    },
    products : [{
        type: mongoose.Types.ObjectId,
        ref : 'Product'
    }]
}, { timestamps: true, versionKey: false })

module.exports = mongoose.model("Category", categorySchema) // plural Categories