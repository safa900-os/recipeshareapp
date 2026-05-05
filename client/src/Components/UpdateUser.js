import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "reactstrap";
import { useDispatch } from "react-redux";
import { updateUser } from "../Features/UserSlice";
import { useForm } from "react-hook-form";

const UpdateUser = () => {
  const dispatch = useDispatch();

  // 1. Get values from URL
  const { user_email, user_name, user_password } = useParams();

  // 2. State variables initialized with URL values
  const [name, setname] = useState(user_name);
  const [email, setemail] = useState(user_email);
  const [password, setpassword] = useState(user_password);
  const [confirmPassword, setconfirmPassword] = useState(user_password);

  // 3. react-hook-form (only for submit handling)
  const { handleSubmit, register } = useForm();

  // 4. Update function
  const handleUpdate = () => {
    const userData = {
      name: name,
      email: email,
      password: password,
    };

    dispatch(updateUser(userData));
    alert("User Updated Successfully!");
  };

  return (
    <Container>
      <h3>Update User</h3>

      <Form className="div-form" onSubmit={handleSubmit(handleUpdate)}>
        
        {/* Name */}
        <Row>
          <Col md={6}>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your name..."
              value={name}
              {...register("name", {
                onChange: (e) => setname(e.target.value),
              })}
            />
          </Col>
        </Row>

        {/* Email */}
        <Row>
          <Col md={6}>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email..."
              value={email}
              {...register("email", {
                onChange: (e) => setemail(e.target.value),
              })}
            />
          </Col>
        </Row>

        {/* Password */}
        <Row>
          <Col md={6}>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password..."
              value={password}
              {...register("password", {
                onChange: (e) => setpassword(e.target.value),
              })}
            />
          </Col>
        </Row>

        {/* Confirm Password */}
        <Row>
          <Col md={6}>
            <input
              type="password"
              className="form-control"
              placeholder="Confirm password..."
              value={confirmPassword}
              {...register("confirmPassword", {
                onChange: (e) => setconfirmPassword(e.target.value),
              })}
            />
          </Col>
        </Row>

        {/* Button */}
        <Row className="mt-3">
          <Col md={6}>
            <Button color="success" type="submit">
              Update User
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default UpdateUser;