const mongoose = require('mongoose')


const shopSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    categories: [{
        type : mongoose.Types.ObjectId,
        ref :  'Category'


}]

}, { timeStamps: true, versionKey: false })

module.exports = mongoose.model("shop", shopSchema)