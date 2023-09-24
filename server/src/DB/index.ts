import mongoose from "mongoose";

const URI = process.env.MONGO_URI as string;

mongoose
  .connect(URI)
  .then(() => {
    console.log("Connexcted to DB");
  })
  .catch((err) => {
    console.log("Connection to DB failed", err);
  });
