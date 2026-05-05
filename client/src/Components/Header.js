import Logo from "../Images/logo.svg";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../Features/UserSlice";
import { useState } from "react";
import { Input } from "reactstrap";

const Header = ({ onSearch }) => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const [search, setSearch] = useState("");

  const handleLogout = async () => {
    dispatch(logout());
    await new Promise((resolve) => setTimeout(resolve, 100));
    navigate("/");
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    if (onSearch) onSearch(e.target.value); // Pass search query up to parent
  };

  return (
    <header style={styles.header}>
      {/* Logo */}
      <div style={styles.logoWrapper}>
        <img src={Logo} alt="RecipeShare Logo" style={{ height: "50px" }} />
      </div>

      {/* Search Box */}
      <div style={styles.searchWrapper}>
        <Input
          type="text"
          placeholder="🔍 Search recipes..."
          value={search}
          onChange={handleSearch}
          style={styles.searchInput}
        />
      </div>

      {/* Nav Links */}
      <nav style={styles.nav}>
        <Link to="/"        style={styles.navLink}>Home</Link>
        <Link to="/profile" style={styles.navLink}>Profile</Link>
        <Link onClick={handleLogout} style={styles.navLink}>Logout</Link>
      </nav>
    </header>
  );
};

const styles = {
  header:       { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 32px", borderBottom: "1px solid #e0e0e0", backgroundColor: "#fff" },
  logoWrapper:  { display: "flex", alignItems: "center" },
  searchWrapper:{ flex: 1, margin: "0 32px" },
  searchInput:  { borderRadius: "20px", border: "1px solid #ccc", padding: "6px 16px", fontSize: "14px" },
  nav:          { display: "flex", gap: "28px", alignItems: "center" },
  navLink:      { textDecoration: "none", color: "#333", fontSize: "15px", fontFamily: "Arial, sans-serif", fontWeight: "500", cursor: "pointer" },
};

export default Header;