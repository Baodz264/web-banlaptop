import UserOtp from "../../database/mysql/user/userOtp.model.js";
import { Op } from "sequelize";

const createOtp = async (data) => {
  return await UserOtp.create(data);
};

const findValidOtp = async (userId, otp) => {
  return await UserOtp.findOne({
    where: {
      user_id: userId,
      otp_code: otp,
      used: false,
      expires_at: {
        [Op.gt]: new Date(), // ✅ chỉ lấy OTP chưa hết hạn
      },
    },
    order: [["created_at", "DESC"]], // ✅ lấy OTP mới nhất
  });
};

const markUsed = async (id) => {
  return await UserOtp.update(
    { used: true },
    { where: { id } }
  );
};

// ✅ THÊM: xoá OTP cũ
const deleteByUserId = async (userId) => {
  return await UserOtp.destroy({
    where: { user_id: userId },
  });
};

export default {
  createOtp,
  findValidOtp,
  markUsed,
  deleteByUserId, // ✅ thêm export
};
