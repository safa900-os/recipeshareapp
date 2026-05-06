import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getRecipes, likeRecipe, deleteRecipe, updateRecipe } from "../Features/RecipeSlice";
import {
  Container, Table, Button,
  Modal, ModalHeader, ModalBody, ModalFooter,
  FormGroup, Label, Input, Badge,
} from "reactstrap";
import { FaHeart, FaRegHeart, FaTrash, FaEdit } from "react-icons/fa";
import moment from "moment";

const Recipes = ({ searchQuery = "" }) => {
  const dispatch = useDispatch();
  const recipes  = useSelector((state) => state.recipes.recipes);
  const userId   = useSelector((state) => state.users.user._id);
  const email    = useSelector((state) => state.users.user.email);

  // ── Edit Modal State ──────────────────────────────────────────
  const [editModal, setEditModal]                   = useState(false);
  const [selectedRecipe, setSelectedRecipe]         = useState(null);
  const [editTitle, setEditTitle]                   = useState("");
  const [editIngredients, setEditIngredients]       = useState("");
  const [editInstructions, setEditInstructions]     = useState("");
  const [editCategory, setEditCategory]             = useState("Lunch");
  const [editDifficulty, setEditDifficulty]         = useState("Easy");
  const [editIsVegetarian, setEditIsVegetarian]     = useState(false);
  const [editLastCooked, setEditLastCooked]         = useState("");

  useEffect(() => {
    dispatch(getRecipes());
  }, [dispatch]);

  // ── Filter recipes based on search query from Header ─────────
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.ingredients.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLike = (recipeId) => {
    dispatch(likeRecipe({ recipeId, userId }));
  };

  const handleDelete = (recipeId) => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      dispatch(deleteRecipe(recipeId));
    }
  };

  const openEditModal = (recipe) => {
    setSelectedRecipe(recipe);
    setEditTitle(recipe.title);
    setEditIngredients(recipe.ingredients);
    setEditInstructions(recipe.instructions);
    setEditCategory(recipe.category || "Lunch");
    setEditDifficulty(recipe.difficulty || "Easy");
    setEditIsVegetarian(recipe.isVegetarian || false);
    setEditLastCooked(
      recipe.lastCooked ? new Date(recipe.lastCooked).toISOString().split("T")[0] : ""
    );
    setEditModal(true);
  };

  const handleUpdate = () => {
    if (!editTitle.trim() || !editIngredients.trim() || !editInstructions.trim()) {
      alert("All fields are required.");
      return;
    }
    dispatch(updateRecipe({
      recipeId:     selectedRecipe._id,
      title:        editTitle,
      ingredients:  editIngredients,
      instructions: editInstructions,
      category:     editCategory,
      difficulty:   editDifficulty,
      isVegetarian: editIsVegetarian,
      lastCooked:   editLastCooked,
    }));
    setEditModal(false);
  };

  // Difficulty badge color
  const difficultyColor = { Easy: "success", Medium: "warning", Hard: "danger" };

  return (
    <Container style={styles.container}>
      <h5 style={styles.heading}>📋 All Shared Recipes</h5>

      {filteredRecipes.length === 0 && (
        <p style={{ color: "#888" }}>No recipes found.</p>
      )}

      <Table striped responsive>
        <thead>
          <tr>
            <th>Image</th>
            <th>Recipe</th>
            <th>Category</th>
            <th>Difficulty</th>
            <th>⏱ Time</th>
            <th>Shared By</th>
            <th>Posted</th>
            <th>Likes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecipes.map((recipe) => (
            <tr key={recipe._id}>

              {/* Image */}
              <td>
                {recipe.imageUrl || recipe.image ? (
                  <img
                    src={recipe.imageUrl || `https://recipeshare-server-nm69.onrender.com/${recipe.image}`}
                    alt={recipe.title}
                    style={{ width: "85px", height: "65px", objectFit: "cover", borderRadius: "6px" }}
                    onError={(e) => e.target.style.display = "none"}
                  />
                ) : (
                  <div style={{ width: "85px", height: "65px", background: "#eee", borderRadius: "6px" }} />
                )}
              </td>

              {/* Recipe Info */}
              <td>
                <strong>{recipe.title}</strong>
                {recipe.isVegetarian && <span style={styles.vegBadge}>🌿 Veg</span>}
                <br />
                <small style={styles.ingredients}><b>Ingredients:</b> {recipe.ingredients}</small>
                <br />
                <small>{recipe.instructions}</small>
                {recipe.lastCooked && (
                  <><br /><small style={{ color: "#aaa" }}>Last cooked: {moment(recipe.lastCooked).format("DD MMM YYYY")}</small></>
                )}
              </td>

              {/* Category — Dropdown result */}
              <td><span style={styles.categoryBadge}>{recipe.category || "—"}</span></td>

              {/* Difficulty — Radio result */}
              <td>
                <Badge color={difficultyColor[recipe.difficulty] || "secondary"}>
                  {recipe.difficulty || "—"}
                </Badge>
              </td>

              {/* Cooking Time — Calculated on server */}
              <td>{recipe.cookingTime ? `${recipe.cookingTime} min` : "—"}</td>

              {/* Shared By */}
              <td>{recipe.email}</td>

              {/* Posted */}
              <td>{moment(recipe.createdAt).fromNow()}</td>

              {/* Like */}
              <td>
                <span onClick={() => handleLike(recipe._id)} style={styles.likeBtn}>
                  {recipe.likes.users.includes(userId)
                    ? <FaHeart color="red" size={18} />
                    : <FaRegHeart color="gray" size={18} />}
                </span>{" "}
                {recipe.likes.count}
              </td>

              {/* Edit & Delete — owner only */}
              <td>
                {recipe.email === email && (
                  <div style={styles.actions}>
                    <span onClick={() => openEditModal(recipe)} style={styles.iconBtn} title="Edit">
                      <FaEdit color="#8a6a3a" size={18} />
                    </span>
                    <span onClick={() => handleDelete(recipe._id)} style={styles.iconBtn} title="Delete">
                      <FaTrash color="red" size={16} />
                    </span>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* ── Edit Modal ──────────────────────────────────────────── */}
      <Modal isOpen={editModal} toggle={() => setEditModal(false)}>
        <ModalHeader toggle={() => setEditModal(false)}>✏️ Edit Recipe</ModalHeader>
        <ModalBody>

          <FormGroup>
            <Label style={styles.label}>Recipe Title</Label>
            <Input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
          </FormGroup>

          {/* Dropdown */}
          <FormGroup>
            <Label style={styles.label}>Category</Label>
            <Input type="select" value={editCategory} onChange={(e) => setEditCategory(e.target.value)}>
              <option>Breakfast</option>
              <option>Lunch</option>
              <option>Dinner</option>
              <option>Dessert</option>
              <option>Snack</option>
            </Input>
          </FormGroup>

          {/* Radio */}
          <FormGroup>
            <Label style={styles.label}>Difficulty Level</Label>
            <div style={styles.radioGroup}>
              {["Easy", "Medium", "Hard"].map((level) => (
                <Label key={level} style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="editDifficulty"
                    value={level}
                    checked={editDifficulty === level}
                    onChange={(e) => setEditDifficulty(e.target.value)}
                    style={{ marginRight: "6px" }}
                  />
                  {level}
                </Label>
              ))}
            </div>
          </FormGroup>

          {/* Checkbox */}
          <FormGroup check style={{ marginBottom: "14px" }}>
            <Label check style={styles.label}>
              <Input
                type="checkbox"
                checked={editIsVegetarian}
                onChange={(e) => setEditIsVegetarian(e.target.checked)}
                style={{ marginRight: "8px" }}
              />
              🌿 Vegetarian Recipe
            </Label>
          </FormGroup>

          {/* Date */}
          <FormGroup>
            <Label style={styles.label}>Last Cooked Date</Label>
            <Input type="date" value={editLastCooked} onChange={(e) => setEditLastCooked(e.target.value)} />
          </FormGroup>

          <FormGroup>
            <Label style={styles.label}>Ingredients</Label>
            <Input type="textarea" rows={3} value={editIngredients} onChange={(e) => setEditIngredients(e.target.value)} />
          </FormGroup>

          <FormGroup>
            <Label style={styles.label}>Instructions</Label>
            <Input type="textarea" rows={3} value={editInstructions} onChange={(e) => setEditInstructions(e.target.value)} />
          </FormGroup>

        </ModalBody>
        <ModalFooter>
          <Button style={styles.saveBtn} onClick={handleUpdate}>Save Changes</Button>
          <Button color="secondary" onClick={() => setEditModal(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

const styles = {
  container:    { marginTop: "30px" },
  heading:      { color: "#4a2c0c", fontFamily: "Georgia, serif", marginBottom: "20px" },
  ingredients:  { color: "#666", display: "block", marginTop: "4px" },
  likeBtn:      { cursor: "pointer" },
  actions:      { display: "flex", gap: "12px", alignItems: "center" },
  iconBtn:      { cursor: "pointer" },
  label:        { fontWeight: "600", color: "#555", fontSize: "13px" },
  saveBtn:      { backgroundColor: "#8a6a3a", border: "none", fontWeight: "600" },
  vegBadge:     { marginLeft: "8px", fontSize: "11px", color: "green" },
  categoryBadge:{ backgroundColor: "#f5e6d0", color: "#8a6a3a", padding: "2px 8px", borderRadius: "10px", fontSize: "12px" },
  radioGroup:   { display: "flex", gap: "20px", marginTop: "6px" },
  radioLabel:   { display: "flex", alignItems: "center", fontWeight: "normal", cursor: "pointer" },
};

export default Recipes;