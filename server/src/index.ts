import express from "express";
import "dotenv/config";
import "./DB";

const app = express();

const PORT = 8989;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
