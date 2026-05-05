import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { login } from "../Features/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  // Track if the user clicked Sign In in THIS session
  const didSubmit = useRef(false);

  const isSuccess = useSelector((state) => state.users.isSuccess);
  const isError   = useSelector((state) => state.users.isError);

  useEffect(() => {
    // Only navigate if the user actually clicked Sign In
    if (!didSubmit.current) return;
    if (isError)   alert("Login failed. Please check your credentials.");
    if (isSuccess) navigate("/");
  }, [isError, isSuccess]);

  const handleLogin = () => {
    didSubmit.current = true;
    dispatch(login({ email, password }));
  };

  return (
    <div style={styles.page}>
      <div style={styles.brandSection}>
        <h1 style={styles.brandTitle}>Recipe<span style={styles.brandAccent}>Share</span></h1>
        <p style={styles.brandSub}>Share . Cook . Inspire</p>
      </div>
      <div style={styles.card}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Email</label>
          <input type="email" placeholder="Enter your email..." value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Password</label>
          <input type="password" placeholder="Enter your password..." value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} />
        </div>
        <button style={styles.loginBtn} onClick={handleLogin}>Sign In</button>
        <p style={styles.signupText}>
          No Account?{" "}
          <Link to="/register" style={styles.signupLink}>Sign Up now.</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page:         { minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 16px", backgroundColor: "#fffdf8" },
  brandSection: { textAlign: "center", marginBottom: "28px" },
  brandTitle:   { fontSize: "52px", fontWeight: "bold", color: "#4a2c0c", margin: 0, fontFamily: "Georgia, serif", letterSpacing: "2px" },
  brandAccent:  { color: "#c8742b", fontStyle: "italic" },
  brandSub:     { fontSize: "13px", letterSpacing: "6px", color: "#888", marginTop: "4px", fontFamily: "Arial, sans-serif" },
  card:         { width: "100%", maxWidth: "440px", padding: "8px 0" },
  formGroup:    { marginBottom: "16px" },
  label:        { display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "600", color: "#333", fontFamily: "Arial, sans-serif" },
  input:        { width: "100%", padding: "11px 14px", border: "1px solid #ccc", borderRadius: "6px", fontSize: "14px", outline: "none", boxSizing: "border-box", fontFamily: "Arial, sans-serif" },
  loginBtn:     { width: "100%", padding: "12px", backgroundColor: "#8a6a3a", color: "#fff", border: "none", borderRadius: "6px", fontSize: "15px", fontWeight: "600", cursor: "pointer", marginTop: "8px" },
  signupText:   { marginTop: "14px", fontSize: "13px", fontWeight: "bold", color: "#333" },
  signupLink:   { color: "#c8742b", textDecoration: "none", fontWeight: "bold" },
};

export default Login;