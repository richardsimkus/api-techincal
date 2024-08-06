import express from "express";

const router = express.Router();

// get home page
router.get("/", function (req, res) {
  res.send("Welcome");
});

export default router;
