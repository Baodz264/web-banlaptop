import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { Link } from "react-router-dom";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

import bannerService from "../../../services/banner.service";

const HomeBanner = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://tbtshoplt.xyz";

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);

      const res = await bannerService.getList({
        position: "home_top",
        status: 1,
      });

      let data = [];

      if (Array.isArray(res?.data)) data = res.data;
      else if (Array.isArray(res?.data?.data)) data = res.data.data;
      else if (Array.isArray(res?.data?.data?.items))
        data = res.data.data.items;

      setBanners(data);
    } catch (err) {
      console.error("Lỗi API:", err);

      // fallback demo
      setBanners([
        {
          id: 1,
          title: "Laptop Gaming Sale",
          image:
            "https://images.unsplash.com/photo-1603302576837-37561b2e2302",
          link: "/products",
        },
        {
          id: 2,
          title: "Điện thoại giảm giá",
          image:
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
          link: "/products",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/1920x500";
    if (path.startsWith("http")) return path;
    return `${API_URL}/${path.replace(/^\/+/, "")}`;
  };

  if (loading) {
    return (
      <div className="px-4 md:px-10 py-6">
        <div
          style={{
            width: "100%",
            aspectRatio: "1920 / 500",
            background: "#e5e7eb",
            borderRadius: "24px",
          }}
          className="animate-pulse"
        />
      </div>
    );
  }

  return (
    <div className="px-4 md:px-10 py-6">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        loop={true}
        effect="fade"
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        className="rounded-3xl overflow-hidden shadow-xl"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            
            {/* 🔥 KHUNG CHUẨN TỶ LỆ 1920:500 */}
            <div
              style={{
                width: "100%",
                aspectRatio: "1920 / 500",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* IMAGE */}
              <img
                src={getImageUrl(banner.image)}
                alt={banner.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
                onError={(e) =>
                  (e.target.src =
                    "https://via.placeholder.com/1920x500?text=Banner")
                }
              />

              {/* OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent"></div>

              {/* CONTENT */}
              <div className="absolute inset-y-0 left-0 flex items-center px-6 md:px-20 text-white z-10">
                <div className="max-w-xl">
                  <h2 className="text-xl md:text-5xl font-bold mb-4 leading-tight">
                    {banner.title || "Siêu khuyến mãi"}
                  </h2>

                  {banner.link && (
                    <Link
                      to={banner.link}
                      className="inline-block bg-white text-black px-6 py-3 md:px-8 md:py-4 rounded-full font-semibold hover:bg-indigo-600 hover:text-white transition"
                    >
                      Mua ngay
                    </Link>
                  )}
                </div>
              </div>
            </div>

          </SwiperSlide>
        ))}
      </Swiper>

      {/* PAGINATION STYLE */}
      <style>{`
        .swiper-pagination-bullet {
          background: rgba(255,255,255,0.5);
          width: 10px;
          height: 10px;
        }
        .swiper-pagination-bullet-active {
          background: white;
          width: 25px;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default HomeBanner;