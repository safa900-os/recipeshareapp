import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: { type: String },
  // For Activity 19 — Admin
  userType: { type: String, default: "user" },
});

const UserModel = mongoose.model("userInfos", UserSchema);
export default UserModel;