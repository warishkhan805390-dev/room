import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function addIdField(obj) {
  if (Array.isArray(obj)) return obj.map(addIdField);
  if (obj && typeof obj === "object") {
    if (obj._id && !obj.id) obj.id = obj._id;
    Object.keys(obj).forEach((k) => {
      if (k !== "id") obj[k] = addIdField(obj[k]);
    });
  }
  return obj;
}

api.interceptors.response.use((res) => {
  res.data = addIdField(res.data);
  return res;
});

export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  profile: () => api.get("/auth/profile"),
  updateProfile: (data) => api.put("/auth/profile", data),
};

export const roomAPI = {
  getAll: (params) => api.get("/rooms", { params }),
  get: (id) => api.get(`/rooms/${id}`),
  create: (data) => api.post("/rooms", data),
  update: (id, data) => api.put(`/rooms/${id}`, data),
  delete: (id) => api.delete(`/rooms/${id}`),
};

export const bookingAPI = {
  create: (data) => api.post("/bookings", data),
  mine: () => api.get("/bookings/mine"),
  all: () => api.get("/bookings"),
  update: (id, data) => api.put(`/bookings/${id}`, data),
};

export const paymentAPI = {
  getFakeCards: () => api.post("/payments/fake-cards"),
  getFakeUPI: () => api.post("/payments/fake-upi"),
  pay: (data) => api.post("/payments/pay", data),
  status: (bookingId) => api.get(`/payments/status/${bookingId}`),
  mine: () => api.get("/payments/mine"),
  all: () => api.get("/payments"),
};

export const adminAPI = {
  dashboard: () => api.get("/admin/dashboard"),
  users: () => api.get("/admin/users"),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};

export default api;
