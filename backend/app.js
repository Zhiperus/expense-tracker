import express from "express";
import cors from "cors";
import collection from "./mongoose.js";
import mongoose from "mongoose";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", cors(), async (req, res) => {
  const { email, password } = req.query;

  try {
    const check = await collection.findOne({ email: email });

    console.log(check);

    if (check != null) {
      const { _id, name, transactions } = check;

      if (check.password === password) {
        res.json({
          status: "success",
          _id: _id,
          name: name,
          transactions: transactions,
        });
      } else {
        res.status(401).send("Password is incorrect!");
      }
    } else {
      res.status(404).send("User does not exist!");
    }
  } catch (e) {
    console.log(e);
  }
});

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  const data = {
    name: name,
    email: email,
    password: password,
    transactions: [],
  };

  try {
    const check = await collection.findOne({ email: email });

    if (check) {
      res.status(409).send("User already exists!");
    } else {
      const response = await collection.insertMany([data]);
      res.json({
        status: "success",
        _id: response[0]._id,
        name: name,
      });
    }
  } catch (e) {
    console.log(e);
  }
});

app.put("/logout", async (req, res) => {
  const { _id, transactions } = req.body;

  console.log(req);
  console.log(req.body);

  try {
    await collection.updateOne(
      { _id: new mongoose.Types.ObjectId(_id) },
      { $set: { transactions: transactions } }
    );
  } catch (e) {
    console.log(e);
  }
});

app.listen(3000, () => {
  console.log("Listening to port 3000...");
});
