import { useState, useEffect } from "react";
import {
  Container, Row, Col, Form, FormGroup,
  Label, Input, Button, Card, CardBody, CardTitle,
} from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Location from "./Location";
import { updateUser } from "../Features/UserSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const email      = useSelector((state) => state.users.user.email);
  const name       = useSelector((state) => state.users.user.name);
  const profilePic = useSelector((state) => state.users.user.profilePic);

  const [newName, setNewName]         = useState(name || "");
  const [newPassword, setNewPassword] = useState("");
  const [image, setImage]             = useState(null);
  const [preview, setPreview]         = useState(null);
  const [updating, setUpdating]       = useState(false);
  const [uploading, setUploading]     = useState(false);

  useEffect(() => {
    if (!email) navigate("/login");
  }, [email]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpdate = async () => {
    if (!newName.trim()) return alert("Name cannot be empty.");
    setUpdating(true);
    try {
      const res = await axios.put(`http://localhost:3001/updateUserProfile/${email}`, {
        name: newName,
        password: newPassword,
      });
      dispatch(updateUser({ name: res.data.user.name }));
      setNewPassword("");
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Update failed.");
    } finally {
      setUpdating(false);
    }
  };

  const handleUploadPic = async () => {
    if (!image) return alert("Please select an image first.");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("profilePic", image);
      const res = await axios.put(
        `http://localhost:3001/updateProfilePic/${email}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      dispatch(updateUser({ profilePic: res.data.user.profilePic }));
      setImage(null);
      setPreview(null);
      alert("Profile picture updated!");
    } catch (error) {
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container style={styles.container}>
      <h4 style={styles.pageTitle}>👤 My Profile</h4>

      <Row className="g-4">

        {/* ── Card 1: Profile Picture ── */}
        <Col md={3}>
          <Card style={styles.card}>
            <CardBody style={{ textAlign: "center" }}>
              <CardTitle style={styles.cardTitle}>Profile Picture</CardTitle>

              <img
                src={
                  preview
                    ? preview
                    : profilePic
                    ? `http://localhost:3001/${profilePic}`
                    : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="Profile"
                style={styles.profilePic}
              />

              <FormGroup style={{ marginTop: "16px", textAlign: "left" }}>
                <Label style={styles.label}>Choose New Photo</Label>
                <Input type="file" accept="image/*" onChange={handleImageChange} />
              </FormGroup>

              <Button
                onClick={handleUploadPic}
                disabled={uploading}
                style={styles.uploadBtn}
                block
              >
                {uploading ? "Uploading..." : "📸 Upload Picture"}
              </Button>
            </CardBody>
          </Card>
        </Col>

        {/* ── Card 2: Account Info ── */}
        <Col md={4}>
          <Card style={styles.card}>
            <CardBody>
              <CardTitle style={styles.cardTitle}>Account Information</CardTitle>

              <Form>
                <FormGroup>
                  <Label style={styles.label}>Full Name</Label>
                  <Input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Enter your name..."
                  />
                </FormGroup>

                <FormGroup>
                  <Label style={styles.label}>Email</Label>
                  <Input type="email" value={email} disabled style={styles.disabledInput} />
                  <small style={styles.hint}>Email cannot be changed</small>
                </FormGroup>

                <FormGroup>
                  <Label style={styles.label}>New Password</Label>
                  <Input
                    type="password"
                    placeholder="Leave blank to keep current..."
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </FormGroup>

                <Button
                  onClick={handleUpdate}
                  disabled={updating}
                  style={styles.updateBtn}
                  block
                >
                  {updating ? "Saving..." : "💾 Save Changes"}
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Col>

        {/* ── Card 3: Location ── */}
        <Col md={4}>
          <Card style={styles.card}>
            <CardBody>
              <CardTitle style={styles.cardTitle}>📍 Your Location</CardTitle>
              <Location />
            </CardBody>
          </Card>
        </Col>

      </Row>
    </Container>
  );
};

const styles = {
  container:    { marginTop: "30px", marginBottom: "40px" },
  pageTitle:    { color: "#4a2c0c", fontFamily: "Georgia, serif", marginBottom: "24px" },
  card:         { border: "1px solid #e8d9c0", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", height: "100%" },
  cardTitle:    { fontSize: "15px", fontWeight: "700", color: "#4a2c0c", borderBottom: "1px solid #f0e0cc", paddingBottom: "10px", marginBottom: "16px" },
  profilePic:   { width: "110px", height: "110px", borderRadius: "50%", objectFit: "cover", border: "3px solid #c8742b", marginTop: "8px" },
  label:        { fontWeight: "600", color: "#555", fontSize: "13px" },
  hint:         { color: "#aaa", fontSize: "11px" },
  disabledInput:{ backgroundColor: "#f9f9f9", color: "#aaa" },
  uploadBtn:    { backgroundColor: "#c8742b", border: "none", fontWeight: "600", marginTop: "8px" },
  updateBtn:    { backgroundColor: "#8a6a3a", border: "none", fontWeight: "600", marginTop: "8px" },
};

export default Profile;