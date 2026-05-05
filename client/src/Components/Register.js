import { Container, Row, Col, Form, Button } from "reactstrap";
import { userSchemaValidation } from "../Validations/UserValidations";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { registerUser } from "../Features/UserSlice";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userSchemaValidation),
  });

  // Handle form submission — async to wait for MongoDB to save
  const onSubmit = async (data) => {
    try {
      const userData = {
        name: data.name,
        email: data.email,
        password: data.password,
      };

      // Wait for the registerUser thunk to complete before navigating
      await dispatch(registerUser(userData)).unwrap();

      alert("Registration successful!");
      reset();
      navigate("/login");
    } catch (error) {
      console.log("Register Error:", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.brandSection}>
        <h1 style={styles.brandTitle}>
          Recipe<span style={styles.brandAccent}>Share</span>
        </h1>
        <p style={styles.brandSub}>Create your account</p>
      </div>

      <div style={styles.card}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          {/* Name */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your name..."
              {...register("name")}
              style={styles.input}
            />
            <p style={styles.error}>{errors.name?.message}</p>
          </div>

          {/* Email */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email..."
              {...register("email")}
              style={styles.input}
            />
            <p style={styles.error}>{errors.email?.message}</p>
          </div>

          {/* Password */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password..."
              {...register("password")}
              style={styles.input}
            />
            <p style={styles.error}>{errors.password?.message}</p>
          </div>

          {/* Confirm Password */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Confirm your password..."
              {...register("confirmPassword")}
              style={styles.input}
            />
            <p style={styles.error}>{errors.confirmPassword?.message}</p>
          </div>

          <button type="submit" style={styles.registerBtn}>
            Create Account
          </button>
        </Form>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 16px",
    backgroundColor: "#fffdf8",
  },
  brandSection: { textAlign: "center", marginBottom: "24px" },
  brandTitle: {
    fontSize: "42px",
    fontWeight: "bold",
    color: "#4a2c0c",
    margin: 0,
    fontFamily: "Georgia, serif",
  },
  brandAccent: { color: "#c8742b", fontStyle: "italic" },
  brandSub: {
    fontSize: "13px",
    letterSpacing: "4px",
    color: "#888",
    marginTop: "4px",
    fontFamily: "Arial, sans-serif",
  },
  card: { width: "100%", maxWidth: "440px" },
  formGroup: { marginBottom: "14px" },
  label: {
    display: "block",
    marginBottom: "5px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
    fontFamily: "Arial, sans-serif",
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  error: { color: "red", fontSize: "12px", margin: "4px 0 0" },
  registerBtn: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#8a6a3a",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "8px",
  },
};

export default Register;