const express = require("express");

const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getTasks);

router.post("/", protect, adminOnly, createTask);

router.put("/:id", protect, updateTask);

router.delete("/:id", protect, adminOnly, deleteTask);

module.exports = router;