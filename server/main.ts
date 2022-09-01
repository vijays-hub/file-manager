import express, { Express } from "express";
import cors from "cors";
const app: Express = express();
const port = 8080;

// Routes Import
import authenticationRoutes from "./api/auth";

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use("/auth", authenticationRoutes);

async function main() {
  try {
    // TODO: Get secrets from GCP.
    app.listen(port, () => {
      console.log(`Express app listening on port ${port}`);
    });
  } catch (error) {
    console.log("Failed to start the server", error);
  }
}

main();
