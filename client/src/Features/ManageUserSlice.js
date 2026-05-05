import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  allUsers: [],
  isLoading: false,
  isError: false,
};

// GET ALL USERS — admin only
export const getAllUsers = createAsyncThunk(
  "allUsers/getAllUsers",
  async () => {
    const response = await axios.get("http://localhost:3001/getUsers");
    return response.data.users;
  }
);

export const manageUserSlice = createSlice({
  name: "allUsers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.allUsers = action.payload;
        state.isLoading = false;
      })
      .addCase(getAllUsers.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default manageUserSlice.reducer;