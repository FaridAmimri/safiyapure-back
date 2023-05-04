/** @format */

const router = require('express').Router()
const User = require('../models/User')
const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

// Send password reset link
router.post('/reset', async (req, res) => {
  const { email } = req.body
  try {
    const oldUser = await User.findOne({ email }) // Check user email exists
    !oldUser && res.status(401).json("Ce compte email n'existe pas")
    res.status(200).json(oldUser)

    const token = jwt.sign(
      { email: oldUser.email, id: oldUser._id },
      process.env.JWT_KEY,
      {
        expiresIn: '5m'
      }
    )
    const link = `http://localhost:5000/api/password/reset/${oldUser._id}/${token}` // When user clicks on forgot password, he will get this link back

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'safiyapurecom@gmail.com',
        pass: process.env.GMAIL_PASSWORD
      }
    })

    var mailOptions = {
      from: 'safiyapurecom@gmail.com',
      to: email,
      subject: 'Réinitialiser votre mot de passe',
      text: link
    }

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error)
      } else {
        console.log('Email sent: ' + info.response)
      }
    })
  } catch (error) {}
})

// Check if user exists in database
router.get('/reset/:id/:token', async (req, res) => {
  const { id, token } = req.params
  console.log(req.params)

  const oldUser = await User.findOne({ _id: id })
  !oldUser && res.status(401).json('Utilisateur inexistant')

  try {
    const verify = jwt.verify(token, process.env.JWT_KEY) // verify if the token belongs to the user
    res.render('index', { email: verify.email, status: 'Not verified' })
  } catch (error) {
    res.send('Not verified') // if token does not match
  }
})

// Reset user password
router.post('/reset/:id/:token', async (req, res) => {
  const { id, token } = req.params

  const oldUser = await User.findOne({ _id: id })
  !oldUser && res.status(401).json('Utilisateur inexistant')

  try {
    const verify = jwt.verify(token, process.env.JWT_KEY)

    const encryptedPassword = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.CRYPTO_KEY
    ).toString()

    await User.findByIdAndUpdate(
      {
        _id: id
      },
      {
        $set: {
          password: encryptedPassword
        }
      }
    )
    res
      .status(201)
      .json(
        'Mot de passe modifié avec succès. Merci de retourner sur la page Login'
      )
  } catch (error) {
    res.status(401).json("Une erreur s'est produite")
  }
})

module.exports = router
