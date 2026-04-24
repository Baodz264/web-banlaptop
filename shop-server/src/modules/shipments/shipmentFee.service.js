import axios from "axios";
import env from "../../config/env.config.js";

class ShipmentFeeService {
  /**
   * 🚀 Gọi Goong API lấy khoảng cách thực tế giữa 2 điểm
   */
  static async getDistanceKm(from_lat, from_lng, to_lat, to_lng) {
    const url = "https://rsapi.goong.io/DistanceMatrix";
    try {
      const res = await axios.get(url, {
        params: {
          origins: `${from_lat},${from_lng}`,
          destinations: `${to_lat},${to_lng}`,
          vehicle: "bike", // Sử dụng xe máy để tính toán đường đi thực tế
          api_key: env.GOONG.API_KEY,
        },
      });

      const element = res.data.rows[0].elements[0];
      if (!element || element.status !== "OK") {
        throw new Error("Không tính được khoảng cách từ Goong");
      }
      return element.distance.value / 1000; // Đổi từ m sang km
    } catch (error) {
      console.error("Goong API Error:", error.message);
      return 5; // Trả về 5km mặc định nếu lỗi để không làm gián đoạn luồng đặt hàng
    }
  }

  /**
   * 🔥 Tính tổng khối lượng của toàn bộ giỏ hàng
   * Nếu sản phẩm không có weight, mặc định là 0.5kg
   */
  static calculateTotalWeight(items = []) {
    return items.reduce((total, item) => {
      const weightPerItem = item.weight || 0.5;
      const quantity = item.quantity || 1;
      return total + weightPerItem * quantity;
    }, 0);
  }

  /**
   * 🔥 MAIN: Tính phí vận chuyển theo mô hình bậc thang (Rẻ như App)
   */
  static async calculateShippingFee({
    from_lat,
    from_lng,
    to_lat,
    to_lng,
    items = [],
    shipping_type = "standard",
  }) {
    // 1. Lấy thông tin đầu vào
    const distance = await this.getDistanceKm(from_lat, from_lng, to_lat, to_lng);
    const weight = this.calculateTotalWeight(items);

    // 2. --- CẤU HÌNH PHÍ KHOẢNG CÁCH (Lũy tiến giảm dần) ---
    const BASE_FEE = 13000; // Phí mở cửa (2km đầu tiên)
    let distanceFee = 0;

    if (distance <= 2) {
      distanceFee = BASE_FEE;
    } else if (distance <= 10) {
      // Từ km thứ 2 đến 10: + 3.500đ/km
      distanceFee = BASE_FEE + (distance - 2) * 3500;
    } else if (distance <= 25) {
      // Từ km thứ 10 đến 25: + 3.000đ/km
      distanceFee = BASE_FEE + (8 * 3500) + (distance - 10) * 3000;
    } else {
      // Trên 25km: + 2.000đ/km (đi càng xa đơn giá mỗi km càng rẻ)
      distanceFee = BASE_FEE + (8 * 3500) + (15 * 3000) + (distance - 25) * 2000;
    }

    // 3. --- CẤU HÌNH PHÍ CÂN NẶNG (Ưu đãi) ---
    const FREE_WEIGHT_LIMIT = 5; // Miễn phí hoàn toàn 5kg đầu tiên
    let weightFee = 0;
    
    if (weight > FREE_WEIGHT_LIMIT) {
      // Mỗi kg vượt thêm chỉ tính 1.500đ
      weightFee = (weight - FREE_WEIGHT_LIMIT) * 1500;
    }

    // 4. --- TỔNG HỢP VÀ PHỤ PHÍ ---
    let totalFee = distanceFee + weightFee;

    // Phụ phí hỏa tốc (Cộng cố định thay vì nhân hệ số để tránh phí quá cao)
    if (shipping_type === "express") {
      totalFee += 15000;
    }

    // 5. --- KHỐNG CHẾ TRẦN (CAP) VÀ LÀM TRÒN ---
    // Đảm bảo phí ship không bao giờ vượt quá 200k cho đơn hàng bình thường
    const MAX_FEE = 200000;
    if (totalFee > MAX_FEE) totalFee = MAX_FEE;

    // Làm tròn về hàng nghìn để khách hàng dễ nhìn (ví dụ 23.400đ -> 23.000đ)
    const finalFee = Math.round(totalFee / 1000) * 1000;

    return {
      distance_km: Number(distance.toFixed(2)),
      total_weight: Number(weight.toFixed(2)),
      // Trả về detail để debug hoặc hiển thị cho khách nếu cần
      detail: {
        distance_fee: Math.round(distanceFee),
        weight_fee: Math.round(weightFee),
        shipping_type_extra: shipping_type === "express" ? 15000 : 0
      },
      shipping_fee: Math.max(finalFee, BASE_FEE), // Không bao giờ thấp hơn phí mở cửa
    };
  }
}

export default ShipmentFeeService;