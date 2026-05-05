import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row } from "reactstrap";
import "./App.css";
import Header   from "./Components/Header";
import Footer   from "./Components/Footer";
import Home     from "./Components/Home";
import Login    from "./Components/Login";
import Profile  from "./Components/Profile";
import Register from "./Components/Register";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";

const App = () => {
  const email = useSelector((state) => state.users.user?.email);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Container fluid style={{ minHeight: "100vh", display: "flex", flexDirection: "column", padding: 0 }}>
      <Row style={{ margin: 0 }}>
        {/* Pass setSearchQuery to Header so search updates state here */}
        {email ? <Header onSearch={setSearchQuery} /> : null}
      </Row>

      <Row style={{ flex: 1, margin: 0 }}>
        <Routes>
          <Route path="/"         element={email ? <Home searchQuery={searchQuery} /> : <Navigate to="/login" />} />
          <Route path="/login"    element={<Login />}    />
          <Route path="/register" element={<Register />} />
          <Route path="/profile"  element={<Profile />}  />
        </Routes>
      </Row>

      <Row style={{ margin: 0 }}>
        {email ? <Footer /> : null}
      </Row>
    </Container>
  );
};

export default App;