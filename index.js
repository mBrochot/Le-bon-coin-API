const express = require("express");
const mongoose = require("mongoose");
const formidable = require("express-formidable");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(formidable());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

//--------Import des routes---------\\
const userRoutes = require("./routes/user");
const offerRoutes = require("./routes/offer");
const payRoutes = require("./routes/pay");

//-----Initialisation des routes-----\\
app.use(userRoutes);
app.use(offerRoutes);
app.use(payRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server started");
});
