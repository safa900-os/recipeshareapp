import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../Features/UserSlice";
import recipeReducer from "../Features/RecipeSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";

// Redux Persist config — saves state to localStorage
const persistConfig = {
  key: "recipeshare-store",
  storage,
};

// Combine all reducers
const rootReducer = combineReducers({
  users: usersReducer,
  recipes: recipeReducer,
});

// Wrap rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

// persistore handles rehydration on page refresh
const persistore = persistStore(store);

export { store, persistore };