import mongoose from "mongoose";
import { MONGO_URI } from "#/utils/variables";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connexcted to DB");
  })
  .catch((err) => {
    console.log("Connection to DB failed", err);
  });
