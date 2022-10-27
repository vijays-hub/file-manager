import dotenv from "dotenv";
dotenv.config();

import express, { Express } from "express";
import cors from "cors";
import { connectToDatabase } from "./utils/config/db";
import { Server } from "http";
import expressFileUpload from "express-fileupload";

const app: Express = express();
const port = 8080;

// Routes Import
import authenticationRoutes from "./api/auth";
import uploadsRoutes from "./api/uploads";
import userResources from "./api/user";
import shareResources from "./api/share";
import downloadResources from "./api/downloads";

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));
app.use(expressFileUpload());

// Routes
app.use("/auth", authenticationRoutes);
app.use("/uploads", uploadsRoutes);
app.use("/share", shareResources);
app.use("/downloads", downloadResources);
app.use("/users", userResources);

let server: Server;
async function main() {
  try {
    // TODO: Get secrets from GCP.

    connectToDatabase();

    server = app.listen(port, () => {
      console.log(`Express app listening on port ${port}`);
    });
  } catch (error) {
    console.log("Failed to start the server", error);
  }
}

// Handle any un-precedented errors.
process.on("unhandledRejection", (err: Error) => {
  console.log(`An error occurred: ${err.message}`);
  server.close(() => process.exit(1));
});

main();
