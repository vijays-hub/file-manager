import userModel from "../../model/User";

const getUserByEmail = async (email: string) =>
  await userModel.findOne({ email });

export default getUserByEmail;
