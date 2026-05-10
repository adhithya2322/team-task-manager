import axios from "axios";

const API = axios.create({
  baseURL: "https://team-task-manager-production-997b.up.railway.app/api",
});

export default API;