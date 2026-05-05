import mongoose from "mongoose";

const RecipeSchema = mongoose.Schema(
  {
    title:        { type: String,  required: true },
    ingredients:  { type: String,  required: true },
    instructions: { type: String,  required: true },
    email:        { type: String,  required: true },
    image:        { type: String },

    // ── New fields (Requirements 2, 3, 5) ──────────────────────
    category:     { type: String,  default: "Lunch" },           // Dropdown
    difficulty:   { type: String,  default: "Easy" },            // Radio
    isVegetarian: { type: Boolean, default: false },             // Checkbox — Boolean ✅
    lastCooked:   { type: Date },                                // Date ✅
    cookingTime:  { type: Number,  default: 0 },                 // Number ✅ (calculated on server)

    likes: {
      count: { type: Number,   default: 0 },
      users: { type: [String], default: [] },
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const RecipeModel = mongoose.model("recipes", RecipeSchema);
export default RecipeModel;