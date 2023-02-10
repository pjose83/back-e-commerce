const mongoose = require("mongoose")

const cardSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  added: {
    type: Date,
    default: Date.now()
  }
})

module.exports = mongoose.model("Card", cardSchema)