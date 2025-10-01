import bcrypt from "bcrypt";
import userCollection from "../models/userModel.js";
import jwt from "jsonwebtoken";

// Register
export const createNewUser = async (req, res) => {
  try {
    const { name, password, email, age = 0, role = "user" } = req.body;

    if (!name || !password || !email) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    const isExist = await userCollection.where("email", "==", email).get();
    if (!isExist.empty) {
      return res
        .status(409)
        .json({ message: "This email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userCollection.add({
      name,
      email,
      password: hashedPassword,
      age,
      role,
    });

    return res.status(201).json({
      message: "User created successfully",
      id: newUser.id,
      email,
      name,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { password, email } = req.body;

    if (!password || !email) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const snapShoot = await userCollection.where("email", "==", email).get();
    if (snapShoot.empty) {
      return res.status(401).json({ message: "Please sign up first" });
    }

    const userDoc = snapShoot.docs[0];
    const userData = userDoc.data();

    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password not correct" });
    }

    const token = jwt.sign(
      { email: userData.email, id: userDoc.id, role: userData.role },
      process.env.JWT_SECRET || "defaultSecret",
      { expiresIn: "1h" }
    );

    const { password: _, ...safeUser } = userData;

    return res.status(200).json({
      message: "Login successful",
      user: { id: userDoc.id, ...safeUser },
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
