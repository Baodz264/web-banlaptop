import { Image } from "antd";
import { useState, useEffect } from "react";

const API_URL = "http://tbtshoplt.xyz";

const ProductImages = ({ 
  product, 
  images = [], 
  mainImage, 
  setMainImage, 
  selectedVariant 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 👉 Gom tất cả ảnh (ưu tiên variant)
  const allImages = product
    ? selectedVariant?.image
      ? [
          `${API_URL}${selectedVariant.image}`, // 🔥 ảnh variant đứng đầu
          `${API_URL}${product.thumbnail}`,
          ...images.map((img) => `${API_URL}${img.image}`),
        ]
      : [
          `${API_URL}${product.thumbnail}`,
          ...images.map((img) => `${API_URL}${img.image}`),
        ]
    : [];

  // 👉 Auto slide
  useEffect(() => {
    if (allImages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev + 4 >= allImages.length) return 0;
        return prev + 4;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [allImages.length]);

  // 👉 Reset slider khi đổi variant
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedVariant]);

  // 👉 Nếu chưa có product
  if (!product) return null;

  const visibleImages = allImages.slice(currentIndex, currentIndex + 4);

  const next = () => {
    if (currentIndex + 4 < allImages.length) {
      setCurrentIndex(currentIndex + 4);
    } else {
      setCurrentIndex(0);
    }
  };

  const prev = () => {
    if (currentIndex - 4 >= 0) {
      setCurrentIndex(currentIndex - 4);
    }
  };

  return (
    <>
      {/* 👉 Ảnh chính */}
      <Image
        src={mainImage}
        width="100%"
        height={400}
        style={{ objectFit: "cover", borderRadius: 10 }}
      />

      {/* 👉 Thumbnail */}
      <div style={{ position: "relative", marginTop: 15 }}>
        <button onClick={prev} style={btnStyle("left")}>◀</button>

        <div style={{ display: "flex", gap: 10 }}>
          {visibleImages.map((imgUrl, index) => (
            <Image
              key={index}
              preview={false}
              src={imgUrl}
              width={80}
              height={80}
              onClick={() => setMainImage(imgUrl)}
              style={{
                objectFit: "cover",
                cursor: "pointer",
                borderRadius: 8,
                border:
                  mainImage === imgUrl
                    ? "2px solid #1890ff"
                    : "1px solid #ddd",
              }}
            />
          ))}
        </div>

        <button onClick={next} style={btnStyle("right")}>▶</button>
      </div>
    </>
  );
};

const btnStyle = (position) => ({
  position: "absolute",
  top: "50%",
  [position]: -10,
  transform: "translateY(-50%)",
  zIndex: 1,
  background: "#fff",
  border: "1px solid #ddd",
  cursor: "pointer",
  padding: "5px 10px",
  borderRadius: 6,
});

export default ProductImages;
