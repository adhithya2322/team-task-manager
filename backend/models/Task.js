const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    project: String,
    assignedTo: String,
    status: String,
    priority: String,
    dueDate: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);