import axiosClient from "./axios.config";

const CartItemService = {

  // ===================== LẤY DANH SÁCH GIỎ HÀNG =====================
  getCartItems: (cart_id) => {
    return axiosClient.get(`/cart-items/cart/${cart_id}`);
  },

  // ===================== THÊM VÀO GIỎ =====================
  addToCart: (data) => {
    return axiosClient.post("/cart-items", data);
  },

  // ===================== CẬP NHẬT SỐ LƯỢNG =====================
  updateCartItem: (id, quantity) => {
    return axiosClient.put(`/cart-items/${id}`, { quantity });
  },

  // ===================== XÓA 1 ITEM =====================
  deleteCartItem: (id) => {
    return axiosClient.delete(`/cart-items/${id}`);
  },

  // ===================== XÓA TOÀN BỘ GIỎ HÀNG =====================
  clearCart: (cart_id) => {
    return axiosClient.delete(`/cart-items/cart/clear/${cart_id}`);
  },

};

export default CartItemService;
