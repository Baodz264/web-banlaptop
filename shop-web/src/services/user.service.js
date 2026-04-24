import axiosClient from "./axios.config";

const userService = {

  /* ================= ADMIN ================= */

  // GET LIST USERS (ADMIN ONLY)
  getUsers(params) {
    return axiosClient.get("/users", { params });
  },

  // GET DETAIL USER
  getUserById(id) {
    return axiosClient.get(`/users/${id}`);
  },

  // CREATE USER
  createUser(data) {
    return axiosClient.post("/users", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // UPDATE USER
  updateUser(id, data) {
    return axiosClient.put(`/users/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // DELETE USER
  deleteUser(id) {
    return axiosClient.delete(`/users/${id}`);
  },

  /* ================= CHAT ================= */

  // GET ADMINS (CUSTOMER CHAT)
  getAdmins() {
    return axiosClient.get("/users/admins");
  },

  /* ================= PROFILE ================= */

  // GET PROFILE
  getProfile() {
    return axiosClient.get("/users/profile");
  },

  // UPDATE PROFILE
  updateProfile(data) {
    return axiosClient.put("/users/profile", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

};

export default userService;
