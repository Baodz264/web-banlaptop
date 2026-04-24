import axios from "axios";

const verifyCaptcha = async (token) => {
  // ✅ FIX: nếu không có token thì bỏ qua (mobile)
  if (!token) return true;

  try {
    const { data } = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET,
          response: token,
        },
      }
    );

    return data.success;
  } catch (err) {
    return false;
  }
};

export default verifyCaptcha;
