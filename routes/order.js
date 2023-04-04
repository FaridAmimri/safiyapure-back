/** @format */

const router = require('express').Router()
const Order = require('../models/Order')
const {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization
} = require('./verifyToken')

// CREATE
router.post('/', verifyToken, async (req, res) => {
  const newOrder = new Order(req.body)

  try {
    const savedOrder = await newOrder.save()
    res.status(201).json(savedOrder)
  } catch (error) {
    res.status(500).json(error)
  }
})

// UPDATE
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body
      },
      { new: true }
    )
    res.status(200).json(updatedOrder)
  } catch (error) {
    res.status(500).json(error)
  }
})

// DELETE
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id)
    res.status(200).json('Order has been deleted successfully')
  } catch (error) {
    res.status(500).json(error)
  }
})

// GET USER ORDERS
router.get('/:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await Order.findById(req.params.id)
    res.status(200).json(orders)
  } catch (error) {
    res.status(500).json(error)
  }
})

// GET ALL Order
router.get('/', verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
    res.status(200).json(orders)
  } catch (error) {
    res.status(500).json(error)
  }
})

module.exports = router
