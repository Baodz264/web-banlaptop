import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false, // dùng cho port 587
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendMail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Ecommerce Support" <${process.env.MAIL_USER}>`,
      to: to,
      subject: subject,
      html: html,
    });

    console.log("Email sent:", info.response);
    return info;
  } catch (error) {
    console.error("Send mail error:", error);
    throw error;
  }
};
