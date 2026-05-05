import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  recipes: [],
  status: "idle",
  error: null,
};

// SAVE RECIPE مع دعم رفع الصورة
export const saveRecipe = createAsyncThunk(
  "recipes/saveRecipe",
  async (formData) => {
    try {
      const response = await axios.post(
        "https://recipeshare-server-nm69.onrender.com/saveRecipe",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.recipe;
    } catch (error) {
      console.log("Save Recipe Error:", error);
      throw error;
    }
  }
);

// GET ALL RECIPES
export const getRecipes = createAsyncThunk(
  "recipes/getRecipes",
  async () => {
    try {
      const response = await axios.get("https://recipeshare-server-nm69.onrender.com/getRecipes");
      return response.data.recipes;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

// DELETE RECIPE
export const deleteRecipe = createAsyncThunk(
  "recipes/deleteRecipe",
  async (recipeId) => {
    await axios.delete(`https://recipeshare-server-nm69.onrender.com/deleteRecipe/${recipeId}`);
    return recipeId; // Return ID to remove it from state
  }
);

// UPDATE RECIPE
export const updateRecipe = createAsyncThunk(
  "recipes/updateRecipe",
  async (recipeData) => {
    const response = await axios.put(
      `https://recipeshare-server-nm69.onrender.com/updateRecipe/${recipeData.recipeId}`,
      {
        title:        recipeData.title,
        ingredients:  recipeData.ingredients,
        instructions: recipeData.instructions,
      }
    );
    return response.data.recipe;
  }
);

// LIKE RECIPE
export const likeRecipe = createAsyncThunk(
  "recipes/likeRecipe",
  async (recipeData) => {
    try {
      const response = await axios.put(
        `https://recipeshare-server-nm69.onrender.com/likeRecipe/${recipeData.recipeId}`,
        { userId: recipeData.userId }
      );
      return response.data.recipe;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

const recipeSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // SAVE RECIPE
      .addCase(saveRecipe.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveRecipe.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.recipes.unshift(action.payload);
      })
      .addCase(saveRecipe.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // GET RECIPES
      .addCase(getRecipes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getRecipes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.recipes = action.payload;
      })
      .addCase(getRecipes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // DELETE RECIPE — remove it from the list by ID
      .addCase(deleteRecipe.fulfilled, (state, action) => {
        state.recipes = state.recipes.filter((r) => r._id !== action.payload);
      })

      // UPDATE RECIPE — replace the old recipe with the updated one
      .addCase(updateRecipe.fulfilled, (state, action) => {
        const index = state.recipes.findIndex((r) => r._id === action.payload._id);
        if (index !== -1) state.recipes[index] = action.payload;
      })

      // LIKE RECIPE
      .addCase(likeRecipe.pending, (state) => {
        state.status = "loading";
      })
      .addCase(likeRecipe.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.recipes.findIndex(
          (r) => r._id === action.payload._id
        );
        if (index !== -1) {
          state.recipes[index] = action.payload;
        }
      })
      .addCase(likeRecipe.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default recipeSlice.reducer;