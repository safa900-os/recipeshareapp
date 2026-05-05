import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  user: {},
  isLoading: false,
  isSuccess: false,
  isError: false,
};

export const registerUser = createAsyncThunk(
  "users/registerUser",
  async (userData) => {
    const response = await axios.post("https://recipeshare-server-nm69.onrender.com/registerUser", userData);
    return response.data.user;
  }
);

export const login = createAsyncThunk("users/login", async (userData) => {
  const response = await axios.post("https://recipeshare-server-nm69.onrender.com/login", userData);
  return response.data.user;
});

export const logout = createAsyncThunk("users/logout", async () => {
  await axios.post("https://recipeshare-server-nm69.onrender.com/logout");
});

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    resetState: (state) => {
      state.isSuccess = false;
      state.isError   = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending,   (state) => { state.isLoading = true;  state.isSuccess = false; state.isError = false; })
      .addCase(registerUser.fulfilled, (state, action) => { state.user = action.payload; state.isLoading = false; state.isSuccess = true; })
      .addCase(registerUser.rejected,  (state) => { state.isLoading = false; state.isError = true; })

      .addCase(login.pending,   (state) => { state.isLoading = true;  state.isSuccess = false; state.isError = false; })
      .addCase(login.fulfilled, (state, action) => { state.user = action.payload; state.isLoading = false; state.isSuccess = true; })
      .addCase(login.rejected,  (state) => { state.isLoading = false; state.isError = true; })

      .addCase(logout.pending,   (state) => { state.isLoading = true; })
      .addCase(logout.fulfilled, (state) => { state.user = {}; state.isLoading = false; state.isSuccess = false; state.isError = false; })
      .addCase(logout.rejected,  (state) => { state.isLoading = false; state.isError = true; });
  },
});

export const { updateUser, resetState } = userSlice.actions;
export default userSlice.reducer;