const razorpay = require("../utils/razorPayInstance")
const payment = require("../models/payment.model")
const user = require("../models/user.model")
const Product = require("../models/product.model")
// const product = require("../models/product.model")
const crypto = require("crypto")
// const payment = require("../models/payment.model")
// const product = require("../models/product.model")

exports.createOnlineOrder = async (req, res) => {
    try {


        const { amount, currency, productId } = req.body
        const userId = req.user.id

        const product = await Product.findById(productId)

        if (!product) {
            return res.status(404).send({
                message: "product not found",
                success: false
            })
        }


        const options = {
            amount: amount * 100,
            currency,
            receipt: `receipt_order_${Date.now()}`,
            notes: {
                productId,
                userId
            }
        }

        const order = await razorpay.orders.create(options)

        await payment.create({
            orderId: order.id,
            userId,
            paymentId: "",
            productId,
            amount : order.amount,
            currency,
            status: "created",
            PaymentMethod: "ONLINE",
            isPaid: false,
        })

        return res.status(200).send({
            message: "order successfull",
            success: true,
            order
        })
    } catch (error) {
        console.log("order failed", error);
        return res.status(500).send({
            message: "order creation failed",
            success: false



        })
    }
}


//_____________________________________________________________________-

exports.verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body


        // signature

        const generateSign = crypto
            .createHash("sha256".process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id} |${razorpay_payment_id}`)
            .digest("hex")

        if (generateSign !== razorpay_signature) {
            await payment.findOneAndUpdate(
                { orderId: razorpay_order_id },
                { status: "failed", isPaid: false }

            )
            return res.status(400).send({
                message: "payment verifcation failed",
                success: false

            })
        }

        // updation if success

        const updatePayment = await payment.findOneAndUpdate(
            { orderId: razorpay_order_id },
            {
                paymentId: razorpay_payment_id,
                status: "paid",
                isPaid: true,
            }, { new: true }
        )

        if (!updatePayment) {
            console.log("no payment record");
            return res.status(404).send({
                message: "no payment record found",
                success: false
            })

        }

        return res.status(200).send({
            success: true,
            message: "payment verifcation successfully",
            payment: updatePayment
        })
    } catch (error) {
        console.error("error while verfying the payment");
        return res.status(500).send({
            message: "Internal server error"
        })

    }
}


//__________________________________________________________

exports.createCOD = async( req,res)=>{
    try {
        const {amount, currency, productId} = req.body

        const product = await Product.findById(productId)

        if(!product){
            return res.status(404).send({
message : "product not found",
success: false
            })
        }

        //create order with cod

        const payment  =new payment({
            userId,
            productId,
            amount,
            currency,
            status: ["created"],
            PaymentMethod : "COD"
        })

        await payment.save()
return res.status(200).send({
    success: true,
    message: "COD order successfully",
    payment
})

    } catch (error) {
        console.error("error while placing COD order",error);
        return res.status(500).send({
            message: "CODE order failed",
            success: false,
        })
        
    }
}