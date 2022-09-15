const Order = require("../models/Order");
const {
  verifyToken,
  verifyTokenAndPermision,
  verifyTokenAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//todo CREATE CART (ALL)
router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);

  try {
    const createdOrder = await newOrder.save();
    res.status(200).json(createdOrder);
  } catch (error) {
    res.status(500).json(error);
  }
});

//todo UPDATE CART (ADMIN)
router.put("/:id", verifyTokenAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json(error);
  }
});

//todo DELETE USERS CART (ADMIN)
router.delete("/:id", verifyTokenAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("El producto ha sido eliminado");
  } catch (error) {
    res.status(500).json(error);
  }
});

//todo GET USERS ORDERS (ALL)
router.get("/find/:id", verifyTokenAdmin, async (req, res) => {
  try {
    const orders = await Order.find({userId:req.params.id});

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json(error);
  }
});

// //todo GET ALL ORDERS
router.get("/",verifyTokenAdmin ,async (req,res) => {
    try {
        const orders = await Order.find()
        res.status(200).json(orders)
    } catch (error) {
        res.status(500).json(error)
    }
})

// //todo MONTHLY INCOME
router.get("/income", verifyTokenAdmin ,  async (req,res) => {

    const date = new Date()
    const lastMonth = new Date(date.setMonth(date.getMonth))
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() -1))

    try {
        const income = await Order.aggregate([
          { $match: { createdAt: { $gte: previousMonth } } },
          {
            $project: {
              month: { $month: "$createdAt" },
              sales: "$amount",
            },
          },
          {
            $group: {
              _id: "$month",
              total: { $sum: "$sales" },
            },
          },
        ]);
        res.status(200).json(income);
      } catch (err) {
        res.status(500).json(err);
      }
})


module.exports = router;