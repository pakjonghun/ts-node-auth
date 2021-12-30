require("dotenv").config();
import "./src/models/index";
import express from "express";
import { routes } from "./src/routes";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:8000",
    credentials: true,
  })
);

app.use(cookieParser());

routes(app);

app.listen(process.env.PORT, () => {
  console.log(`server is starting port ${process.env.PORT}`);
});
