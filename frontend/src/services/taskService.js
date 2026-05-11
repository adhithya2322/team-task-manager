import API from "./api";

// GET TASKS
export const getTasks = async () => {
  return await API.get("/tasks");
};

// CREATE TASK
export const createTask = async (taskData) => {
  return await API.post("/tasks", taskData);
};

// DELETE TASK
export const deleteTask = async (id) => {
  return await API.delete(`/tasks/${id}`);
};

// UPDATE TASK STATUS
export const updateTaskStatus = async (id, status) => {
  return await API.put(`/tasks/${id}`, {
    status,
  });
};