import Mongoose from "mongoose";

// A general type is defined for PublicLink
const PublicLinkSchema = new Mongoose.Schema({
  hash: {
    type: String,
    required: true,
    unique: true,
  },
  file: {
    type: Mongoose.Schema.Types.Mixed,
    required: true,
  },
  sharedBy: {
    type: Mongoose.Schema.Types.Mixed,
    required: true,
  },
  createdAt: {
    type: Number,
    required: true,
  },
});

const publicLinkModel = Mongoose.model("public_link", PublicLinkSchema);
export default publicLinkModel;
