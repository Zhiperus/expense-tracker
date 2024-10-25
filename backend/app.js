import express from "express";
import cors from "cors";
import collection from "./mongoose.js";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", cors(), async (req, res) => {
  const { email, password } = req.body;

  try {
    const check = await collection.findOne({ email: email });

    const { name, transactions } = check;

    if (check) {
      if (check.password === password) {
        res.statusCode = 200;
        res.json({ name: name, transactions: transactions });
      } else {
        res.statusCode = 401;
        res.json({ message: "Password is incorrect." });
      }
    } else {
      res.statusCode = 404;
      res.json({ message: "User does not exist." });
    }
  } catch (e) {
    res.json(e);
  }
});

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  const data = {
    name: name,
    email: email,
    password: password,
  };

  try {
    const check = await collection.findOne({ email: email });

    if (check) {
      res.end("User already exists");
    } else {
      res.end("User created");
      await collection.insertMany([data]);
    }
  } catch (e) {
    res.end(e);
  }
});

app.listen(3000, () => {
  console.log("Listening to port 3000...");
});
