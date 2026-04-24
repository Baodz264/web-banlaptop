import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import User from "../database/mysql/user/user.model.js";

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,

      // 🔥 FIX: dùng domain thật
      callbackURL: `${process.env.BASE_URL}/api/auth/facebook/callback`,

      profileFields: ["id", "displayName", "emails", "photos"],
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        // ✅ Lấy email (fallback nếu FB không trả email)
        const email =
          profile.emails?.[0]?.value || `${profile.id}@facebook.com`;

        // 1️⃣ tìm theo facebook_id
        let user = await User.findOne({
          where: { facebook_id: profile.id },
        });

        // 2️⃣ nếu chưa có → tìm theo email
        if (!user) {
          user = await User.findOne({
            where: { email },
          });

          // 3️⃣ nếu email tồn tại → cập nhật facebook_id
          if (user) {
            await user.update({
              facebook_id: profile.id,
              avatar: profile.photos?.[0]?.value || user.avatar,
            });
          } else {
            // 4️⃣ nếu email chưa tồn tại → tạo user mới
            user = await User.create({
              name: profile.displayName,
              email: email,
              facebook_id: profile.id,
              avatar: profile.photos?.[0]?.value || null,
              role: "customer",
              status: 1,
            });
          }
        }

        return done(null, user);
      } catch (error) {
        console.error("Facebook login error:", error);
        return done(error, null);
      }
    }
  )
);

export default passport;
