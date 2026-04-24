import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../database/mysql/user/user.model.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,

      // 🔥 FIX QUAN TRỌNG
      callbackURL: `${process.env.BASE_URL}/api/auth/google/callback`,
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        // ✅ Lấy email (Google luôn có)
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("Không lấy được email từ Google"), null);
        }

        // 1️⃣ tìm theo google_id
        let user = await User.findOne({
          where: { google_id: profile.id },
        });

        // 2️⃣ nếu chưa có → tìm theo email
        if (!user) {
          user = await User.findOne({
            where: { email },
          });

          if (user) {
            // cập nhật google_id nếu user đã tồn tại
            await user.update({
              google_id: profile.id,
              avatar: profile.photos?.[0]?.value || user.avatar,
            });
          } else {
            // tạo user mới
            user = await User.create({
              name: profile.displayName,
              email: email,
              google_id: profile.id,
              avatar: profile.photos?.[0]?.value || null,
              password: "google_login", // placeholder
              role: "customer",
              status: 1,
            });
          }
        }

        return done(null, user);
      } catch (error) {
        console.error("Google login error:", error);
        return done(error, null);
      }
    }
  )
);

export default passport;
