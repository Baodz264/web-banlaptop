import qs from "qs";
import crypto from "crypto";
import moment from "moment";

class VNPayService {

  // ✅ sort + encode value chuẩn VNPay
  static sortObject(obj) {
    const sorted = {};
    const keys = Object.keys(obj).sort();

    keys.forEach((key) => {
      let value = obj[key];

      if (value !== undefined && value !== null && value !== "") {
        // 🔥 encode value + replace space
        sorted[key] = encodeURIComponent(value).replace(/%20/g, "+");
      }
    });

    return sorted;
  }

  static createPaymentUrl(order, ipAddr) {

    const tmnCode = process.env.VNP_TMNCODE?.trim();
    const secretKey = process.env.VNP_HASHSECRET?.trim();
    const vnpUrl = process.env.VNP_URL?.trim();
    const returnUrl = process.env.VNP_RETURNURL?.trim();

    console.log("TMNCODE:", tmnCode);
    console.log("SECRET:", secretKey);

    const createDate = moment().format("YYYYMMDDHHmmss");
    const amount = Math.round(Number(order.total) * 100);

    if (ipAddr === "::1") {
      ipAddr = "127.0.0.1";
    }

    let vnpParams = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: tmnCode,
      vnp_Locale: "vn",
      vnp_CurrCode: "VND",
      vnp_TxnRef: String(order.id),
      vnp_OrderInfo: `Thanh toan don hang ${order.id}`, // ⚠️ có space → phải encode
      vnp_OrderType: "other",
      vnp_Amount: amount,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate
    };

    // ✅ sort + encode value
    vnpParams = this.sortObject(vnpParams);

    // ❗ stringify KHÔNG encode nữa
    const signData = qs.stringify(vnpParams, { encode: false });

    console.log("SIGN DATA:", signData);

    // ✅ tạo hash
    const signed = crypto
      .createHmac("sha512", secretKey)
      .update(signData, "utf-8")
      .digest("hex");

    console.log("HASH:", signed);

    // ✅ thêm chữ ký
    vnpParams["vnp_SecureHash"] = signed;

    // ❗ URL cũng KHÔNG encode lại (vì đã encode value rồi)
    const paymentUrl =
      vnpUrl + "?" + qs.stringify(vnpParams, { encode: false });

    return paymentUrl;
  }
}

export default VNPayService;
