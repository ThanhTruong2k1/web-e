const express = require("express");

const {
    userCart,
    getUserCart,
    emptyCart,
} = require('../controller/cartCtrl');

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/cart", authMiddleware, userCart);
router.get("/cart", authMiddleware, getUserCart);
router.delete("/empty-cart", authMiddleware, emptyCart);

module.exports= router;