require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

// ======================
// MIDDLEWARE
// ======================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// ======================
// ROOT ROUTE
// ======================

app.get("/", (req, res) => {
  res.send("Backend running successfully");
});

// ======================
// API ROUTES
// ======================

app.use("/api/auth", authRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api/tasks", taskRoutes);

// ======================
// DATABASE CONNECTION
// ======================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT}`
      );
    });
  })
  .catch((error) => {
    console.log("MongoDB Error:", error);
  });