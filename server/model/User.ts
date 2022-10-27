import Mongoose from "mongoose";

const UserSchema = new Mongoose.Schema({
  username: {
    type: String,
    unique: false,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  uploaded: {
    type: Mongoose.Schema.Types.Mixed,
    required: true,
    default: [],
  },
});

const userModel = Mongoose.model("user", UserSchema);
export default userModel;
