const mongoose = require("mongoose");

const Offer = mongoose.model("Offer", {
  created: Date,
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  description: String,
  picture: Object,
  price: Number,
});

module.exports = Offer;
