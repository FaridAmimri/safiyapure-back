/** @format */

const router = require('express').Router()
const User = require('../models/User')
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin
} = require('./verifyToken')

// UPDATE
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.CRYPTO_KEY
    ).toString()
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body
      },
      { new: true }
    )
    res.status(200).json(updatedUser)
  } catch (error) {
    res.status(500).json(error)
  }
})

// DELETE
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.status(200).json('User has been deleted successfully')
  } catch (error) {
    res.status(500).json(error)
  }
})

// GET ONE USER
router.get('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    const { password, ...others } = user._doc

    res.status(200).json(others)
  } catch (error) {
    res.status(500).json(error)
  }
})

// GET ALL USERS
router.get('/', verifyTokenAndAdmin, async (req, res) => {
  try {
    const users = await User.find()
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json(error)
  }
})
module.exports = router
