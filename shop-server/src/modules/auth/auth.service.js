import authRepository from "./auth.repository.js";
import otpRepository from "./otp.repository.js";

import { hashPassword, comparePassword } from "../../utils/hash.js";
import generateOtp from "../../utils/generateOtp.js";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../config/jwt.config.js";

import { sendMail } from "../../config/mail.config.js";

import {
  BadRequestError,
  UnauthorizedError,
} from "../../middlewares/error.middleware.js";

class AuthService {
  /* ================= REGISTER ================= */

  async register(data) {
    const { name, email, password } = data;

    const existingUser = await authRepository.findByEmail(email);
    if (existingUser) {
      throw new BadRequestError("Email đã tồn tại");
    }

    const hashedPassword = await hashPassword(password);

    const user = await authRepository.createUser({
      name,
      email,
      password: hashedPassword,
      role: "customer", // bạn có thể đổi nếu cần
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  /* ================= LOGIN ================= */

  async login({ email, password }) {
    const user = await authRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedError("Email hoặc mật khẩu không đúng");
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedError("Email hoặc mật khẩu không đúng");
    }

    const tokens = await this.generateTokens(user);

    return {
      ...tokens,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role, 
      },
    };
  }

  /* ================= SOCIAL LOGIN ================= */

  async socialLogin(user) {
    if (!user) {
      throw new UnauthorizedError("Social authentication failed");
    }

    const tokens = await this.generateTokens(user);

    return {
      ...tokens,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  /* ================= TOKEN ================= */

  async generateTokens(user) {
    const payload = {
      id: user.id,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await authRepository.saveRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  /* ================= REFRESH ================= */

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw new UnauthorizedError("Refresh token là bắt buộc");
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await authRepository.findById(decoded.id);

    if (!user || user.refresh_token !== refreshToken) {
      throw new UnauthorizedError("Refresh token không hợp lệ");
    }

    const tokens = await this.generateTokens(user);

    return {
      ...tokens,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  /* ================= LOGOUT ================= */

  async logout(userId) {
    const user = await authRepository.findById(userId);

    if (!user) {
      throw new UnauthorizedError("Không tìm thấy người dùng");
    }

    await authRepository.revokeRefreshToken(user.id);
    return true;
  }

  /* ================= FORGOT PASSWORD ================= */

  async forgotPassword(email) {
    const user = await authRepository.findByEmail(email);

    if (!user) {
      throw new BadRequestError("Email không tồn tại");
    }

    await otpRepository.deleteByUserId(user.id);

    const otp = generateOtp();

    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 5);

    await otpRepository.createOtp({
      user_id: user.id,
      otp_code: otp,
      expires_at: expires,
    });

    await sendMail(
      user.email,
      "Reset Password OTP",
      `<h3>Your OTP is: ${otp}</h3>`
    );

    return true;
  }

  /* ================= VERIFY OTP ================= */

  async verifyOtp(email, otp) {
    const user = await authRepository.findByEmail(email);

    if (!user) {
      throw new BadRequestError("User không tồn tại");
    }

    const otpData = await otpRepository.findValidOtp(user.id, otp);

    if (!otpData) {
      throw new BadRequestError("OTP sai hoặc đã hết hạn");
    }

    return true;
  }

  /* ================= RESET PASSWORD ================= */

  async resetPassword(email, otp, newPassword) {
    const user = await authRepository.findByEmail(email);

    if (!user) {
      throw new BadRequestError("User không tồn tại");
    }

    const otpData = await otpRepository.findValidOtp(user.id, otp);

    if (!otpData) {
      throw new BadRequestError("OTP không hợp lệ hoặc đã hết hạn");
    }

    const hashedPassword = await hashPassword(newPassword);

    await authRepository.updatePassword(user.id, hashedPassword);
    await otpRepository.markUsed(otpData.id);

    return true;
  }

  /* ================= CHANGE PASSWORD ================= */

  async changePassword(userId, oldPassword, newPassword) {
    const user = await authRepository.findById(userId);

    if (!user) {
      throw new UnauthorizedError("User không tồn tại");
    }

    const match = await comparePassword(oldPassword, user.password);

    if (!match) {
      throw new BadRequestError("Mật khẩu cũ không đúng");
    }

    const hashedPassword = await hashPassword(newPassword);

    await authRepository.updatePassword(user.id, hashedPassword);

    return true;
  }
}

export default new AuthService();
