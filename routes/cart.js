const Cart = require("../models/Cart");
const {
  verifyToken,
  verifyTokenAndPermision,
  verifyTokenAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//todo CREATE CART (ALL)
router.post("/", verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);

  try {
    const createdCart = await newCart.save();
    res.status(200).json(createdCart);
  } catch (error) {
    res.status(500).json(error);
  }
});

//todo UPDATE CART (ALL)
router.put("/:id", verifyTokenAndPermision, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json(error);
  }
});

//todo DELETE CART (ALL)
router.delete("/:id", verifyTokenAndPermision, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("El producto ha sido eliminado");
  } catch (error) {
    res.status(500).json(error);
  }
});

//todo GET USER CART (ALL)
router.get("/find/:id", verifyTokenAndPermision, async (req, res) => {
  try {
    const cart = await Cart.findOne({userId:req.params.id});

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json(error);
  }
});

// //todo GET ALL CART
router.get("/",verifyTokenAdmin ,async (req,res) => {
    try {
        const carts = await Cart.find()
        res.status(200).json(carts)
    } catch (error) {
        res.status(500).json(error)
    }
})


module.exports = router;
