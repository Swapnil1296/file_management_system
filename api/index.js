const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const client = require("./config/dbConfig");
const getUserRouter = require("./routers/user.routes");

dotenv.config();
const port = process.env.PORT;
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/user", getUserRouter);

app.listen(port, function (err) {
  if (err) {
    console.log("Error while starting server");
  } else {
    console.log(`Server has been started at ${port}`);
  }
});
// customize middleware to send the error response to every controller using next()
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const errorMessage = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    statusCode,
    errorMessage,
  });
});
