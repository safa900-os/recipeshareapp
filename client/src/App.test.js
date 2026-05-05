import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import usersReducer from "./Features/UserSlice";
import recipesReducer from "./Features/RecipeSlice";
import Login from "./Components/Login";
import Register from "./Components/Register";
import ShareRecipe from "./Components/ShareRecipe";
import Header from "./Components/Header";

// Helper: create a test store
const createTestStore = (preloadedState = {}) =>
  configureStore({
    reducer: { users: usersReducer, recipes: recipesReducer },
    preloadedState,
  });

const renderWithStore = (component, store) =>
  render(
    <Provider store={store}>
      <MemoryRouter>{component}</MemoryRouter>
    </Provider>
  );

// ── Test 1: Login page renders correctly ─────────────────────
test("TC01 - Login page renders email and password inputs", () => {
  const store = createTestStore();
  renderWithStore(<Login />, store);
  expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
  expect(screen.getByText(/sign in/i)).toBeInTheDocument();
});

// ── Test 2: Register page renders all fields ──────────────────
test("TC02 - Register page renders name, email, password fields", () => {
  const store = createTestStore();
  renderWithStore(<Register />, store);
  expect(screen.getByPlaceholderText(/enter your name/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
  expect(screen.getByText(/create account/i)).toBeInTheDocument();
});

// ── Test 3: ShareRecipe renders all required controls ─────────
test("TC03 - ShareRecipe renders Dropdown, Radio, Checkbox, Date controls", () => {
  const store = createTestStore({
    users: { user: { email: "test@test.com" }, isSuccess: false, isError: false },
  });
  renderWithStore(<ShareRecipe />, store);
  expect(screen.getByText(/category/i)).toBeInTheDocument();
  expect(screen.getByText(/difficulty level/i)).toBeInTheDocument();
  expect(screen.getByText(/vegetarian/i)).toBeInTheDocument();
  expect(screen.getByText(/last cooked date/i)).toBeInTheDocument();
});

// ── Test 4: Search box in Header updates value ────────────────
test("TC04 - Header search box accepts user input", () => {
  const store = createTestStore({
    users: { user: { email: "test@test.com" } },
  });
  renderWithStore(<Header />, store);
  const searchInput = screen.getByPlaceholderText(/search recipes/i);
  fireEvent.change(searchInput, { target: { value: "Biryani" } });
  expect(searchInput.value).toBe("Biryani");
});

// ── Test 5: Radio buttons change difficulty ───────────────────
test("TC05 - Difficulty radio buttons can be selected", () => {
  const store = createTestStore({
    users: { user: { email: "test@test.com" }, isSuccess: false, isError: false },
  });
  renderWithStore(<ShareRecipe />, store);
  const hardRadio = screen.getByDisplayValue("Hard");
  fireEvent.click(hardRadio);
  expect(hardRadio).toBeChecked();
});