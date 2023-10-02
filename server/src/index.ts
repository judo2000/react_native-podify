import express from "express";
import "dotenv/config";
import "./DB";

import authRouter from "./routers/auth";

const app = express();

// register our middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/auth", authRouter);
app.use(express.static("src/public"));

const PORT = 8989;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
