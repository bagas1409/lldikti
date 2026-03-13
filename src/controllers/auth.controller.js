import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../models/user.model.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExist = await findUserByEmail(email);

    if (userExist) {
      return res.status(400).json({ message: "Email already used" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await createUser(name, email, hashed);

    res.json({
      message: "Register success",
      user,
    });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      message: "Login success",
      token,
      user,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
