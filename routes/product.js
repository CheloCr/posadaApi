const Product = require("../models/Product");
const {
  verifyToken,
  verifyTokenAndPermision,
  verifyTokenAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//todo CREATE PRODUCT (JUST ADMIN)
router.post("/", verifyTokenAdmin, async (req, res) => {
  const newProduct = new Product(req.body);

  try {
    const createdPorduct = await newProduct.save();
    res.status(200).json(createdPorduct);
  } catch (error) {
    res.status(500).json(error);
  }
});

//todo UPDATE (JUST ADMIN)
router.put("/:id", verifyTokenAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json(error);
  }
});

//todo DELETE (JUST ADMIN)
router.delete("/:id", verifyTokenAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("El producto ha sido eliminado");
  } catch (error) {
    res.status(500).json(error);
  }
});

//todo GET PRODUCT (ALL)
router.get("/find/:id", async (req, res) => {
  try {
    const selectedProduct = await Product.findById(req.params.id);
    
    res.status(200).json(selectedProduct);
    console.log("selected PRODUCT",selectedProduct)
  } catch (error) {
    res.status(500).json(error);
  }
});

//todo GET ALL PRODUCTS (JUST ADMIN)
router.get("/", async (req, res) => {
  const queryNew = req.query.new; // ==> ?new=true
  const queryCategory = req.query.category;

  try {
    let products;

    if (queryNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(5);
    } else if (queryCategory) {
      products = await Product.find({
        categories: {
          $in: [queryCategory],
        },
      });
    } else {
        products = await Product.find()
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
