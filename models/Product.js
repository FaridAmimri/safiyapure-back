/** @format */

const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    categories: { type: Array },
    type: { type: Array },
    conditioning: { type: String, required: true },
    price: { type: Number, required: true },
    inStock: { type: Boolean, default: true }
  },
  { timestamps: true }
  // create createdAt and updatedAT times
)

module.exports = mongoose.model('Product', ProductSchema)
