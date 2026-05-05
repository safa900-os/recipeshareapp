import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import fs from "fs";

import UserModel   from "./Models/UserModel.js";
import RecipeModel from "./Models/RecipeModel.js";

const app = express();
app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads";
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
app.use("/uploads", express.static("uploads"));

const connectString = `mongodb+srv://76s197_db_user:JvwNdLQpQoieBrWq@cluster0.p7tvcw5.mongodb.net/recipeShareDb?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(connectString)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Error:", err));

app.get("/", (req, res) => res.send("RecipeShare API is running"));

/* ── REGISTER ── */
app.post("/registerUser", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserModel({ name, email, password: hashedPassword });
    const savedUser = await user.save();
    res.status(201).json({ user: savedUser, msg: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ── LOGIN ── */
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ error: "Wrong password" });
    res.status(200).json({ user, message: "Login successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── LOGOUT ── */
app.post("/logout", (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});

/* ── UPDATE USER PROFILE ── */
app.put("/updateUserProfile/:email", async (req, res) => {
  try {
    const { name, password } = req.body;
    const userToUpdate = await UserModel.findOne({ email: req.params.email });
    if (!userToUpdate) return res.status(404).json({ error: "User not found" });
    userToUpdate.name = name;
    if (password && password !== userToUpdate.password) {
      userToUpdate.password = await bcrypt.hash(password, 10);
    }
    await userToUpdate.save();
    res.json({ user: userToUpdate, msg: "Profile updated." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── UPDATE PROFILE PICTURE ── */
app.put("/updateProfilePic/:email", upload.single("profilePic"), async (req, res) => {
  try {
    const userToUpdate = await UserModel.findOne({ email: req.params.email });
    if (!userToUpdate) return res.status(404).json({ error: "User not found" });
    if (userToUpdate.profilePic && fs.existsSync(userToUpdate.profilePic)) {
      fs.unlinkSync(userToUpdate.profilePic);
    }
    userToUpdate.profilePic = req.file.path;
    await userToUpdate.save();
    res.json({ user: userToUpdate, msg: "Profile picture updated." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── SAVE RECIPE WITH CALCULATIONS (Requirement 3) ── */
app.post("/saveRecipe", upload.single("image"), async (req, res) => {
  try {
    const { title, ingredients, instructions, email, category, difficulty, isVegetarian, lastCooked } = req.body;
    const imagePath = req.file ? req.file.path : null;

    // ── SERVER-SIDE BUSINESS LOGIC & CALCULATIONS ──────────────
    // Calculate estimated cooking time based on difficulty level
    const difficultyTimeMap = { Easy: 20, Medium: 45, Hard: 90 };
    const cookingTime = difficultyTimeMap[difficulty] || 30;

    // Count number of ingredients (split by comma or newline)
    const ingredientCount = ingredients
      .split(/,|\n/)
      .map((i) => i.trim())
      .filter((i) => i.length > 0).length;

    // Add extra time for recipes with many ingredients (5 min per extra ingredient over 5)
    const extraTime = ingredientCount > 5 ? (ingredientCount - 5) * 5 : 0;
    const totalCookingTime = cookingTime + extraTime;

    // Validate lastCooked date — must not be in the future
    if (lastCooked && new Date(lastCooked) > new Date()) {
      return res.status(400).json({ error: "Last cooked date cannot be in the future." });
    }
    // ──────────────────────────────────────────────────────────

    const recipe = new RecipeModel({
      title,
      ingredients,
      instructions,
      email,
      image:        imagePath,
      category,
      difficulty,
      isVegetarian: isVegetarian === "true" || isVegetarian === true,
      lastCooked:   lastCooked || null,
      cookingTime:  totalCookingTime, // Calculated value stored in DB
    });

    const savedRecipe = await recipe.save();
    res.status(201).json({ recipe: savedRecipe, msg: "Recipe saved successfully" });
  } catch (error) {
    console.log("Save Recipe Error:", error);
    res.status(500).json({ error: error.message });
  }
});

/* ── GET ALL RECIPES ── */
app.get("/getRecipes", async (req, res) => {
  try {
    const recipes = await RecipeModel.find({}).sort({ createdAt: -1 });
    res.status(200).json({ recipes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── LIKE / UNLIKE RECIPE ── */
app.put("/likeRecipe/:recipeId", async (req, res) => {
  try {
    const { recipeId } = req.params;
    const { userId }   = req.body;
    const recipe = await RecipeModel.findOne({ _id: recipeId });
    if (!recipe) return res.status(404).json({ msg: "Recipe not found." });
    const userIndex = recipe.likes.users.indexOf(userId);
    if (userIndex !== -1) {
      const updated = await RecipeModel.findOneAndUpdate(
        { _id: recipeId },
        { $inc: { "likes.count": -1 }, $pull: { "likes.users": userId } },
        { new: true }
      );
      res.json({ recipe: updated, msg: "Recipe unliked." });
    } else {
      const updated = await RecipeModel.findOneAndUpdate(
        { _id: recipeId },
        { $inc: { "likes.count": 1 }, $addToSet: { "likes.users": userId } },
        { new: true }
      );
      res.json({ recipe: updated, msg: "Recipe liked." });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── DELETE RECIPE ── */
app.delete("/deleteRecipe/:recipeId", async (req, res) => {
  try {
    const deleted = await RecipeModel.findByIdAndDelete(req.params.recipeId);
    if (!deleted) return res.status(404).json({ msg: "Recipe not found." });
    if (deleted.image && fs.existsSync(deleted.image)) fs.unlinkSync(deleted.image);
    res.status(200).json({ msg: "Recipe deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── UPDATE RECIPE ── */
app.put("/updateRecipe/:recipeId", async (req, res) => {
  try {
    const { title, ingredients, instructions, category, difficulty, isVegetarian, lastCooked } = req.body;

    // Recalculate cooking time on update as well
    const difficultyTimeMap = { Easy: 20, Medium: 45, Hard: 90 };
    const cookingTime = difficultyTimeMap[difficulty] || 30;
    const ingredientCount = ingredients.split(/,|\n/).filter((i) => i.trim()).length;
    const extraTime = ingredientCount > 5 ? (ingredientCount - 5) * 5 : 0;
    const totalCookingTime = cookingTime + extraTime;

    const updatedRecipe = await RecipeModel.findByIdAndUpdate(
      req.params.recipeId,
      { title, ingredients, instructions, category, difficulty,
        isVegetarian: isVegetarian === "true" || isVegetarian === true,
        lastCooked, cookingTime: totalCookingTime },
      { new: true }
    );
    if (!updatedRecipe) return res.status(404).json({ msg: "Recipe not found." });
    res.status(200).json({ recipe: updatedRecipe, msg: "Recipe updated successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── GET ALL USERS (Admin) ── */
app.get("/getUsers", async (req, res) => {
  try {
    const users = await UserModel.find({}).sort({ name: 1 });
    const count = await UserModel.countDocuments({});
    res.json({ users, count });
  } catch (err) {
    res.status(500).json({ error: "An error occurred" });
  }
});

app.listen(3001, () => console.log("Server running on port 3001"));