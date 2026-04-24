import authService from "./auth.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import response from "../../utils/response.js";
import verifyCaptcha from "../../utils/verifyCaptcha.js";

class AuthController {
  /* ================= REGISTER ================= */

  register = asyncHandler(async (req, res) => {
    const { captchaToken } = req.body;

    // ✅ chỉ verify khi có captcha (web)
    if (captchaToken) {
      const isHuman = await verifyCaptcha(captchaToken);

      if (!isHuman) {
        return response.error(res, "reCAPTCHA không hợp lệ", 400);
      }
    }

    const user = await authService.register(req.body);

    return response.created(res, user, "Đăng ký thành công");
  });

  /* ================= LOGIN ================= */

  login = asyncHandler(async (req, res) => {
    const { captchaToken } = req.body;

    // ✅ chỉ verify khi có captcha
    if (captchaToken) {
      const isHuman = await verifyCaptcha(captchaToken);

      if (!isHuman) {
        return response.error(res, "reCAPTCHA không hợp lệ", 400);
      }
    }

    const tokens = await authService.login(req.body);

    return response.success(res, tokens, "Đăng nhập thành công");
  });

  /* ================= REFRESH ================= */

  refresh = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    const tokens = await authService.refresh(refreshToken);

    return response.success(res, tokens, "Làm mới token thành công");
  });

  /* ================= LOGOUT ================= */

  logout = asyncHandler(async (req, res) => {
    await authService.logout(req.user.id);

    return response.success(res, null, "Đăng xuất thành công");
  });

  /* ================= FORGOT PASSWORD ================= */

  forgotPassword = asyncHandler(async (req, res) => {
    await authService.forgotPassword(req.body.email);

    return response.success(res, null, "OTP đã được gửi về email");
  });

  /* ================= VERIFY OTP ================= */

  verifyOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    await authService.verifyOtp(email, otp);

    return response.success(res, null, "OTP hợp lệ");
  });

  /* ================= RESET PASSWORD ================= */

  resetPassword = asyncHandler(async (req, res) => {
    const { email, otp, newPassword } = req.body;

    await authService.resetPassword(email, otp, newPassword);

    return response.success(res, null, "Đặt lại mật khẩu thành công");
  });

  /* ================= CHANGE PASSWORD ================= */

  changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    await authService.changePassword(req.user.id, oldPassword, newPassword);

    return response.success(res, null, "Đổi mật khẩu thành công");
  });

  /* ================= GOOGLE ================= */

  googleCallback = asyncHandler(async (req, res) => {
    const tokens = await authService.socialLogin(req.user);

    const redirectUrl =
       `${process.env.FRONTEND_URL}/oauth-success?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`;

    return res.redirect(redirectUrl);
  });

  /* ================= FACEBOOK ================= */

  facebookCallback = asyncHandler(async (req, res) => {
    const tokens = await authService.socialLogin(req.user);

    const redirectUrl =
      `${process.env.FRONTEND_URL}/oauth-success?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`;

    return res.redirect(redirectUrl);
  });
}

export default new AuthController();
