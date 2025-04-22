const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    image:{
        type : String,
        default : null
    },
    name : {
        type : String,
        required  :true
    },
    description : {
        type : String,
        required : true
    },
    price : {
        type  :Number,
        reuired : true
    },
    categoryId : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required : true
    },
    link : {
        type :String,
        reuired : true
    }
},{timestamps : true, versionKey : false})

const product = mongoose.model('Product',productSchema)

module.exports = product