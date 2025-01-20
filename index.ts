import express, { Express, Request, Response } from "express";
import cors from "cors";
import productRouter from "./routes/productRoutes";
import userRouter from "./routes/userRoutes";
import orderRouter from "./routes/orderRoutes";
import errorHandleMiddleware from "./middleware/Error";
import cookie_parser from "cookie-parser";
import bodyParser from "body-parser";
import { PrismaClient } from "@prisma/client";

const PORT = process.env.PORT || 3001;
// const dotenv = require('dotenv')

const app: Express = express();

//catch unCaughtexception
process.on("uncaughtException", (err) => {
  console.log("Error : " + err);

  server.close(() => {
    process.exit(1);
  });
});

//app.use
const allowedOrigins = ["http://localhost:3000"];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};
app.use(cors(options));
app.use(express.json());
app.use(cookie_parser());
app.use(bodyParser.urlencoded({ extended: true }));

// set env var
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "./config.env" });
}

// Initiate Prisma Client and export it
export const prismaClient = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

// use routes
app.get("/", (req: Request, res: Response) => {
  res.json("Hello World");
});
app.use("/api/", productRouter);
app.use("/api/", userRouter);
app.use("/api/", orderRouter);

// error handle middleware
app.use(errorHandleMiddleware);

//
//
// listening
const server = app.listen(PORT, () => {
  console.log(`Listening at ${PORT}`);
});

//close server automatically on unhandled rejection
process.on("unhandledRejection", (err) => {
  console.log("Error : " + err);

  server.close(() => {
    process.exit(1);
  });
});
