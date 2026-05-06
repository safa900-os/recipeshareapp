import { Button, Input, Container, FormGroup, Label } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { saveRecipe } from "../Features/RecipeSlice";

const ShareRecipe = () => {
  const dispatch = useDispatch();
  const email    = useSelector((state) => state.users.user.email);

  const [title, setTitle]             = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [image, setImage]             = useState(null);

  // ── New fields for requirements ──────────────────────────────
  const [category, setCategory]       = useState("Lunch");      // Dropdown
  const [difficulty, setDifficulty]   = useState("Easy");       // Radio
  const [isVegetarian, setIsVegetarian] = useState(false);      // Checkbox
  const [lastCooked, setLastCooked]   = useState("");           // Date

  const handleShare = async () => {
    if (!title.trim() || !ingredients.trim() || !instructions.trim()) {
      alert("Title, Ingredients and Instructions are required.");
      return;
    }

    const formData = new FormData();
    formData.append("title",        title);
    formData.append("ingredients",  ingredients);
    formData.append("instructions", instructions);
    formData.append("email",        email);
    formData.append("category",     category);
    formData.append("difficulty",   difficulty);
    formData.append("isVegetarian", isVegetarian);
    formData.append("lastCooked",   lastCooked);
    if (image) formData.append("image", image);

    dispatch(saveRecipe(formData));

    // Reset all fields
    setTitle(""); setIngredients(""); setInstructions("");
    setImage(null); setCategory("Lunch"); setDifficulty("Easy");
    setIsVegetarian(false); setLastCooked("");
  };

  return (
    <Container style={styles.container}>
      <h5 style={styles.heading}>🍳 Share a Recipe</h5>

      {/* Recipe Title — TextBox */}
      <FormGroup>
        <Label style={styles.label}>Recipe Title</Label>
        <Input type="text" placeholder="e.g. Chicken Biryani..." value={title} onChange={(e) => setTitle(e.target.value)} />
      </FormGroup>

      {/* Category — Dropdown */}
      <FormGroup>
        <Label style={styles.label}>Category</Label>
        <Input type="select" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>Breakfast</option>
          <option>Lunch</option>
          <option>Dinner</option>
          <option>Dessert</option>
          <option>Snack</option>
        </Input>
      </FormGroup>

      {/* Difficulty — Radio */}
      <FormGroup>
        <Label style={styles.label}>Difficulty Level</Label>
        <div style={styles.radioGroup}>
          {["Easy", "Medium", "Hard"].map((level) => (
            <Label key={level} style={styles.radioLabel}>
              <input
                type="radio"
                name="difficulty"
                value={level}
                checked={difficulty === level}
                onChange={(e) => setDifficulty(e.target.value)}
                style={{ marginRight: "6px" }}
              />
              {level}
            </Label>
          ))}
        </div>
      </FormGroup>

      {/* Vegetarian — Checkbox */}
      <FormGroup check style={{ marginBottom: "14px" }}>
        <Label check style={styles.label}>
          <Input
            type="checkbox"
            checked={isVegetarian}
            onChange={(e) => setIsVegetarian(e.target.checked)}
            style={{ marginRight: "8px" }}
          />
          🌿 Vegetarian Recipe
        </Label>
      </FormGroup>

      {/* Last Cooked — Date */}
      <FormGroup>
        <Label style={styles.label}>Last Cooked Date</Label>
        <Input type="date" value={lastCooked} onChange={(e) => setLastCooked(e.target.value)} />
      </FormGroup>

      {/* Ingredients — Textarea */}
      <FormGroup>
        <Label style={styles.label}>Ingredients</Label>
        <Input type="textarea" placeholder="List the ingredients..." value={ingredients} onChange={(e) => setIngredients(e.target.value)} rows={3} />
      </FormGroup>

      {/* Instructions — Textarea */}
      <FormGroup>
        <Label style={styles.label}>Instructions</Label>
        <Input type="textarea" placeholder="Describe the steps..." value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={3} />
      </FormGroup>

      {/* Image Upload */}
      <FormGroup>
        <Label style={styles.label}>Recipe Photo (Optional)</Label>
        <Input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
      </FormGroup>

      <Button onClick={handleShare} style={styles.shareBtn}>
        🍽️ Share Recipe
      </Button>
    </Container>
  );
};

const styles = {
  container:   { backgroundColor: "#fffdf8", padding: "20px", borderRadius: "10px", marginTop: "20px", border: "1px solid #e8d9c0" },
  heading:     { color: "#4a2c0c", fontFamily: "Georgia, serif", marginBottom: "16px" },
  label:       { fontWeight: "600", color: "#555", fontFamily: "Arial, sans-serif", fontSize: "13px" },
  radioGroup:  { display: "flex", gap: "20px", marginTop: "6px" },
  radioLabel:  { display: "flex", alignItems: "center", fontWeight: "normal", cursor: "pointer" },
  shareBtn:    { backgroundColor: "#8a6a3a", border: "none", borderRadius: "6px", fontWeight: "600", padding: "10px 24px" },
};

export default ShareRecipe;