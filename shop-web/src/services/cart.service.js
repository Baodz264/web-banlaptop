import axiosClient from "./axios.config";

const CartService = {

  // Lấy cart của user (đã login)
  getCartByUser: () => {
    return axiosClient.get("/carts/user");
  },

  // Lấy cart theo session (guest)
  getCartBySession: (session_key) => {
    return axiosClient.get("/carts/session", {
      params: { session_key }
    });
  },
  createCart: (data) => {
    return axiosClient.post("/carts", data);
  },

  // Xóa cart
  deleteCart: (id) => {
    return axiosClient.delete(`/carts/${id}`);
  }

};

export default CartService;
