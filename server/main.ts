import express from "express";
import cors from "cors";
const app = express();
const port = 8080;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/login", (req, res) => {
  console.log({ body: req.body });
  const EMAIL = "karthik@gmail.com";
  const PASSWORD = "pvr@1234";
  const { email, password }: { email: string; password: string } = req.body;

  if (email !== EMAIL)
    return res
      .status(401)
      .send({ message: "This email doesn't exist. Try creating an account" });

  if (password !== PASSWORD)
    return res
      .status(401)
      .send({ message: "Your password is incorrect. Please try again." });

  console.log({ email, password, PASSWORD });
  res.status(200).send({
    message: "Login successful!",
  });
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
