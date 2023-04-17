import "dotenv/config";
import express from "express";
import cors from "cors";
import { router } from "./routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(router);
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

const start = (): void => {
  try {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};
start();
