process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const cookieParser = require("cookie-parser");


const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

const path = require("path");

app.use(express.static(path.join(__dirname, "frontend")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "signup.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "login.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dashboard.html"));
});


app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});
