import axiosClient from "./axios.config";

const WishlistService = {
  // Lấy danh sách wishlist của user
  getWishlist: () => {
    return axiosClient.get("/wishlists");
  },

  // Thêm sản phẩm vào wishlist
  addWishlist: (data) => {
    return axiosClient.post("/wishlists", data);
  },

  // Xóa sản phẩm khỏi wishlist
  removeWishlist: (product_id) => {
    return axiosClient.delete(`/wishlists/${product_id}`);
  },
};

export default WishlistService;
