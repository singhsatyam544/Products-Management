const cartModel = require("../models/cartModel")
const productModel = require("../models/productModel")
const userModel = require("../models/userModel")

const {isValid,isValidObjectId,isValidRequestBody,isValidPassword,isValidFiles,} = require("../validations/validation");

///////////////////////////////////////---------------------------Create Cart----------------/////////////////////////////////

const createCart = async function (req, res) {
    try {
        const data = req.body;
        console.log(data)
        const userId = req.params.userId;
        let { productId, cartId } = data

        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Please give a valid userId" })
        }
        if (!userId == req.userId) {
            return res.status(403).send({ status: false, message: "You are not able to create the cart" })//authorizaton
        }
        if (!isValidRequestBody(data)) {
            return res.status(400).send({ status: false, message: "Please give some data for create cart" })
        }
        if (cartId) {
            if (!isValid(cartId)) {
                return res.status(400).status({ status: false, message: "cardId should not be empty" })
            }
            if (!isValidObjectId(cartId)) {
                return res.status(400).send({ staus: false, message: "Please provide a valid projectId" })
            }
        }
        if (!isValid(productId)) {
            return res.status(400).send({ status: false, message: "Please provide a productId" })
        }
        if (!isValidObjectId(productId)) {
            return res.status(400).send({ status: false, message: "Please provide a valid productId" })
        }
        const product = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!product) {
            return res.status(404).send({ status: false, message: "product is not exist or already deleted" })
        }
        const cart = await cartModel.findOne({ userId: userId })
        if (!cart) {
            if (cartId) return res.status(400).send({ status: false, message: "This cart is not exist for this particular user" })
            let addCart = {
                userId: userId,
                items: [{ productId: productId, quantity: 1 }],
                totalPrice: product.price,
                totalItems: 1,
            }


            const create = await cartModel.create(addCart)
            return res.status(201).send({ status: true, message: "Success", data: create })
        }

        if (cart) {
            if (!cartId) {
                return res.status(400).send({ status: false, message: "please provide cartId for this particuler user" })

            }
            if (cart._id.toString() != cartId) {
                return res.status(404).send({ status: false, message: "Cart id is not correct" })
            }
            let arr = cart.items;
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].productId == productId) {
                    arr[i].quantity = arr[i].quantity + 1
                    const updateCart = await cartModel.findOneAndUpdate({ userId: userId }, { items: arr, totalPrice: cart.totalPrice + cart.totalPrice }, { new: true })
                    return res.status(201).send({ status: false, message: "Success", data: updateCart })
                }
                let newCart = {
                    $addToSet: { items: { productId: product, quantity: 1 } },
                    totalPrice: product.price + cart.totalPrice,
                    totalItems: cart.totalItems + 1
                }
                const updateCart = await cartModel.findOneAndUpdate({ userId: userId }, newCart, { new: true })
                return res.status(201).send({ status: false, message: "Success", data: updateCart })



            }


        }


    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}
module.exports = {createCart}