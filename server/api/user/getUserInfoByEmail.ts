import userModel from "../../model/User";

const getUserByEmail = async (email: string) =>
  (await userModel.findOne({ email })) ?? null;

export default getUserByEmail;
