import axios from "axios";

const notificationApi = axios.create({
  baseURL: import.meta.env.VITE_NOTIFICATION_API_UR || "http://localhost:7170",
  headers: {
    "Content-Type": "application/json",
  },
});

export default notificationApi;
