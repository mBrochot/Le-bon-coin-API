const express = require("express");
const formidable = require("express-formidable");
const router = express.Router();
const cors = require("cors");

const stripe = require("stripe")(
  "sk_test_51HCRiMCNmlttfPiZ6pnTByfwHe7grwlEUHIZ9WwCNudKDsoaaGPjLq0WE28IppymhgYjPCG8zc2XaohR9jvM92Yv00P4xJAIBU"
);

const app = express();
app.use(formidable());
app.use(cors());

router.post("/pay", async (req, res) => {
  console.log(req.fields);
  const response = await stripe.charges.create({
    amount: req.fields.amount * 100,
    currency: "eur",
    description: req.fields.description,
    source: req.fields.stripeToken,
  });

  res.json(response);
});

module.exports = router;
