const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   MONGODB CONNECTION
========================= */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() =>
    console.log("MongoDB Connected")
  )
  .catch((err) =>
    console.log(err)
  );

/* =========================
   USER MODEL
========================= */

const userSchema =
  new mongoose.Schema(
    {
      email: {
        type: String,
        required: true,
        unique: true,
      },

      password: {
        type: String,
        required: true,
      },

      role: {
        type: String,
        enum: [
          "Admin",
          "Member",
        ],
        default: "Member",
      },
    },
    {
      timestamps: true,
    }
  );

const User = mongoose.model(
  "User",
  userSchema
);

/* =========================
   TASK MODEL
========================= */

const taskSchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },

      assignedTo: {
        type: String,
        default: "",
      },

      dueDate: {
        type: String,
        default: "",
      },

      status: {
        type: String,
        default: "Pending",
      },

      userId: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",
      },
    },
    {
      timestamps: true,
    }
  );

const Task = mongoose.model(
  "Task",
  taskSchema
);

/* =========================
   AUTH MIDDLEWARE
========================= */

const authMiddleware = (
  req,
  res,
  next
) => {
  try {
    const token =
      req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        message: "No Token",
      });
    }

    const decoded = jwt.verify(
      token,
      "secretkey"
    );

    req.user = decoded;

    next();
  } catch (error) {
    console.log(error);

    res.status(401).json({
      message: "Invalid Token",
    });
  }
};

/* =========================
   REGISTER
========================= */

app.post(
  "/api/register",
  async (req, res) => {
    try {
      const {
        email,
        password,
        role,
      } = req.body;

      const existingUser =
        await User.findOne({
          email,
        });

      if (existingUser) {
        return res.status(400).json({
          message:
            "User already exists",
        });
      }

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      const user =
        await User.create({
          email,
          password:
            hashedPassword,
          role,
        });

      res.json({
        message:
          "Register Success",
        user,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Register Failed",
      });
    }
  }
);

/* =========================
   LOGIN
========================= */

app.post(
  "/api/login",
  async (req, res) => {
    try {
      const {
        email,
        password,
      } = req.body;

      const user =
        await User.findOne({
          email,
        });

      if (!user) {
        return res.status(400).json({
          message:
            "User not found",
        });
      }

      const isMatch =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!isMatch) {
        return res.status(400).json({
          message:
            "Invalid Password",
        });
      }

      const token = jwt.sign(
        {
          id: user._id,
          role: user.role,
        },
        "secretkey",
        {
          expiresIn: "7d",
        }
      );

      res.json({
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Login Failed",
      });
    }
  }
);

/* =========================
   GET TASKS
========================= */

app.get(
  "/api/tasks",
  authMiddleware,
  async (req, res) => {
    try {
      let tasks;

      if (
        req.user.role === "Admin"
      ) {
        tasks = await Task.find();
      } else {
        tasks = await Task.find({
          userId: req.user.id,
        });
      }

      res.json(tasks);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Fetch Failed",
      });
    }
  }
);

/* =========================
   ADD TASK
========================= */

app.post(
  "/api/tasks",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        title,
        assignedTo,
        dueDate,
      } = req.body;

      const task =
        await Task.create({
          title,
          assignedTo,
          dueDate,
          userId: req.user.id,
        });

      res.json(task);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Task Add Failed",
      });
    }
  }
);

/* =========================
   UPDATE TASK STATUS
========================= */

app.put(
  "/api/tasks/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const { status } =
        req.body;

      const updatedTask =
        await Task.findByIdAndUpdate(
          req.params.id,
          {
            status,
          },
          {
            new: true,
          }
        );

      res.json(updatedTask);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Update Failed",
      });
    }
  }
);

/* =========================
   DELETE TASK
========================= */

app.delete(
  "/api/tasks/:id",
  authMiddleware,
  async (req, res) => {
    try {
      await Task.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message:
          "Task Deleted",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Delete Failed",
      });
    }
  }
);

/* =========================
   SERVER
========================= */

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});