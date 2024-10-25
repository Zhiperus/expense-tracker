import mongoose, { mongo } from "mongoose";
mongoose
  .connect(
    "mongodb+srv://Zhiperus:Theaircrafters0987@cluster0.g5xdp.mongodb.net/"
  )
  .then(() => {
    console.log("Connected to the database.");
  })
  .catch(() => {
    console.log("Connection failed.");
  });

const newSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  transactions: {
    type: Array,
    required: true,
  },
});

const collection = mongoose.model("users", newSchema);

export default collection;
