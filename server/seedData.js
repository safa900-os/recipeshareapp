// ============================================================
// seedData.js — Run this ONCE to populate MongoDB with sample data
// Usage: node seedData.js
// Place this file inside the server/ folder
// ============================================================

import mongoose from "mongoose";
import bcrypt   from "bcrypt";
import UserModel   from "./Models/UserModel.js";
import RecipeModel from "./Models/RecipeModel.js";

const connectString = `mongodb+srv://76s197_db_user:JvwNdLQpQoieBrWq@cluster0.p7tvcw5.mongodb.net/recipeShareDb?retryWrites=true&w=majority&appName=Cluster0`;

const usersData = [
  { name: "Jasmin Tumulak",   email: "jasmine@utas.edu.om", password: "12345" },
  { name: "Marian Malig-on",  email: "marian@utas.edu.om",  password: "12345" },
  { name: "Ahmed Ali Jaboob", email: "ahmed@utas.edu.om",   password: "12345" },
  { name: "Sara Al Balushi",  email: "sara@utas.edu.om",    password: "12345" },
  { name: "Omar Al Farsi",    email: "omar@utas.edu.om",    password: "12345" },
];

const recipesData = [
  {
    title: "Chicken Biryani",
    ingredients: "Chicken, Basmati Rice, Onion, Tomato, Spices, Yogurt, Oil",
    instructions: "Marinate chicken, fry onions, layer rice and chicken, cook on low heat for 30 minutes.",
    email: "jasmine@utas.edu.om",
    category: "Lunch",
    difficulty: "Medium",
    isVegetarian: false,
    lastCooked: new Date("2024-10-15"),
    cookingTime: 45,
    likes: { count: 3, users: [] },
  },
  {
    title: "Vegetable Pasta",
    ingredients: "Pasta, Tomato Sauce, Bell Pepper, Mushroom, Garlic, Olive Oil, Cheese",
    instructions: "Boil pasta, saute vegetables, mix with sauce, top with cheese and serve.",
    email: "marian@utas.edu.om",
    category: "Dinner",
    difficulty: "Easy",
    isVegetarian: true,
    lastCooked: new Date("2024-11-01"),
    cookingTime: 20,
    likes: { count: 5, users: [] },
  },
  {
    title: "Omani Shuwa",
    ingredients: "Lamb, Shuwa Spices, Banana Leaves, Garlic, Lemon",
    instructions: "Marinate lamb with spices overnight, wrap in banana leaves, slow cook underground for 24 hours.",
    email: "ahmed@utas.edu.om",
    category: "Dinner",
    difficulty: "Hard",
    isVegetarian: false,
    lastCooked: new Date("2024-09-20"),
    cookingTime: 90,
    likes: { count: 7, users: [] },
  },
  {
    title: "Chocolate Brownies",
    ingredients: "Flour, Cocoa Powder, Sugar, Butter, Eggs, Vanilla, Chocolate Chips",
    instructions: "Mix dry ingredients, melt butter with chocolate, combine all, bake at 180C for 25 minutes.",
    email: "sara@utas.edu.om",
    category: "Dessert",
    difficulty: "Easy",
    isVegetarian: true,
    lastCooked: new Date("2024-11-10"),
    cookingTime: 25,
    likes: { count: 4, users: [] },
  },
  {
    title: "Avocado Toast",
    ingredients: "Bread, Avocado, Lemon, Salt, Pepper, Chili Flakes, Egg",
    instructions: "Toast bread, mash avocado with lemon and salt, spread on toast, top with fried egg.",
    email: "omar@utas.edu.om",
    category: "Breakfast",
    difficulty: "Easy",
    isVegetarian: true,
    lastCooked: new Date("2024-11-12"),
    cookingTime: 20,
    likes: { count: 2, users: [] },
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(connectString);
    console.log("MongoDB Connected");

    // Clear existing data
    await UserModel.deleteMany({});
    await RecipeModel.deleteMany({});
    console.log("Cleared existing data");

    // Insert users with hashed passwords
    const hashedUsers = await Promise.all(
      usersData.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      }))
    );
    await UserModel.insertMany(hashedUsers);
    console.log("✅ 5 Users inserted");

    // Insert recipes
    await RecipeModel.insertMany(recipesData);
    console.log("✅ 5 Recipes inserted");

    console.log("🎉 Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.log("Seed Error:", error);
    process.exit(1);
  }
};

seedDatabase();