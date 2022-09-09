import Mongoose from "mongoose";

const DATABASE_URI = process.env.DATABASE_URI;

const connectToDatabase = async () => {
  await Mongoose.connect(DATABASE_URI, () => {
    console.log("Connected to Database...");
  });
};

const getDBConnectionState = () => Mongoose.connection.readyState;

export { connectToDatabase, };
