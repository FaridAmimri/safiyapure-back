/** @format */

const router = require('express').Router()
const User = require('../models/User')
const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken')

// REGISTER
router.post('/register', async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.CRYPTO_KEY
    ).toString() // crypt password and convert it to string
  })

  try {
    const savedUser = await newUser.save()
    res.status(201).json(savedUser) // send savedUser with status 201 (succesfull added)
  } catch (err) {
    res.status(500).json(err)
  }
})

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    !user && res.status(401).json('Email ou mot de passe incorrect !') // If no user return message

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.CRYPTO_KEY
    )
    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8)

    originalPassword !== req.body.password &&
      res.status(401).json('Email ou mot de passe incorrect !')

    const accessToken = jwt.sign(
      {
        id: user._id, // Using id user to check if the user belong to this account and can make CRUD operations
        isAdmin: user.isAdmin // if user is admin, he can make CRUD operations for any collection
      },
      process.env.JWT_KEY,
      { expiresIn: '3d' }
    )

    const { password, ...others } = user._doc // Destructure user info and send all infos except password

    res.status(200).json({ ...others, accessToken })
  } catch (error) {
    res.status(500).json(error)
  }
})

module.exports = router
