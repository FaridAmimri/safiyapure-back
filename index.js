/** @format */

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const authRoute = require('./routes/auth')
const passwordResetRoute = require('./routes/passwordReset')
const userRoute = require('./routes/user')
const productRoute = require('./routes/product')
const cartRoute = require('./routes/cart')
const orderRoute = require('./routes/order')
const stripeRoute = require('./routes/stripe')
const cors = require('cors')

dotenv.config()

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => {
    log.error(err)
  })

app.use(cors()) // Give access to AJAX requests from navigator to server
app.use(express.json()) // Give access to request body
app.use('/api/auth', authRoute)
app.use('/api/users', userRoute)
app.use('/api/products', productRoute)
app.use('/api/carts', cartRoute)
app.use('/api/orders', orderRoute)
app.use('/api/checkout', stripeRoute)
app.use('/api/password', passwordResetRoute)

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.listen(process.env.PORT || 5000, () => {
  console.log('Backend server is running')
})
