import { useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ShareRecipe from "./ShareRecipe";
import Recipes from "./Recipes";

const Home = ({ searchQuery = "" }) => {
  const email    = useSelector((state) => state.users.user.email);
  const navigate = useNavigate();

  useEffect(() => {
    if (!email) navigate("/login");
  }, [email]);

  return (
    <Container>
      <Row>
        <Col md={12}>
          <ShareRecipe />
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          {/* Pass searchQuery down to Recipes for filtering */}
          <Recipes searchQuery={searchQuery} />
        </Col>
      </Row>
    </Container>
  );
};

export default Home;