import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/me", authMiddleware, (req, res) => {
  res.json({
    message: "User profile",
    user: req.user,
  });
});

export default router;
