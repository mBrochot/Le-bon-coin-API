const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "mathieub",
  api_key: "424179485552711",
  api_secret: "_2xU2_VA7jzbkUhIAcsGZ4qQDOA",
});

//----------Import des models----------\\

const Offer = require("../models/Offer");
const User = require("../models/User");

const isAuthenticated = require("../middleware/isAuthenticated");

//----------Page Publish----------\\

router.post("/offer/publish", isAuthenticated, async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.files.picture.path);
    // Création de la nouvelle annonce
    const newOffer = new Offer({
      created: new Date(),
      creator: req.user,
      title: req.fields.title,
      description: req.fields.description,
      picture: result,
      price: req.fields.price,
    });

    await newOffer.save();

    res.json({
      created: newOffer.created,
      creator: {
        account: newOffer.creator.account,
        _id: newOffer._id,
      },
      title: newOffer.title,
      description: newOffer.description,
      picture: newOffer.picture,
      price: newOffer.price,
      _id: newOffer._id,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//----------Page with-count----------\\

router.get("/offer/with-count", async (req, res) => {
  try {
    const filters = {};

    if (req.query.title) {
      filters.title = new RegExp(req.query.title, "i");
    }
    if (req.query.priceMin) {
      filters.price = {
        $gte: req.query.priceMin,
      };
    }
    if (req.query.priceMax) {
      if (filters.price) {
        filters.price.$lte = req.query.priceMax;
      } else {
        filters.price = {
          $lte: req.query.priceMax,
        };
      }
    }

    let sort = {};

    if (req.query.sort === "date-asc") {
      sort = { created: "asc" };
    } else if (req.query.sort === "date-desc") {
      sort = { created: "desc" };
    } else if (req.query.sort === "price-asc") {
      sort = { price: "asc" };
    } else if (req.query.sort === "price-desc") {
      sort = { price: "desc" };
    }

    let page = Number(req.query.page);
    let limit = Number(req.query.limit);

    // // Rechercher dans la BDD les annonces qui match avec les query envoyées
    const offers = await Offer.find(filters)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({
        path: "creator",
        select: "account.username account.phone",
      });

    const count = await Offer.countDocuments(filters);

    res.json({
      count: count,
      offers: offers,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//----------Page :id----------\\

router.get("/offer/:id", async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id).populate({
      path: "creator",
      select: "account.username account.phone",
    });
    res.json(offer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
