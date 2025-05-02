const mongoose = require("mongoose")

const paymentSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    paymentId: {
        type: String,
        
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: "INR"
    },
    status: {
        type: String,
        enum: ["created", "paid", "failed"],
        default: "created"
    },
    PaymentMethod: {
        type: String,
        enum: ["COD","ONLINE"],
        required : true
    }
}, { timestamps: true, versionKey: false })

const payment = mongoose.model("payment", paymentSchema)

module.exports = payment