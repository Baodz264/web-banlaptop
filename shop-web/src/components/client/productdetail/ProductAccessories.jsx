import { useEffect, useState, useRef, useCallback } from "react";
import { Card, Typography, Tag, Button } from "antd";
import { Link } from "react-router-dom";
import {
  LeftOutlined,
  RightOutlined,
  EyeOutlined,
} from "@ant-design/icons";

import variantService from "../../../services/variant.service";

const { Text } = Typography;
const API_URL = "http://tbtshoplt.xyz";

const ProductAccessories = ({ accessories = [] }) => {
  const [variantMap, setVariantMap] = useState({});
  const scrollRef = useRef(null);

  // ================= LOAD VARIANT =================
  
  // Sử dụng useCallback để đóng gói hàm, tránh tạo lại hàm khi component re-render
  // trừ khi chính "accessories" thay đổi.
  const fetchVariants = useCallback(async () => {
    const map = {};

    try {
      await Promise.all(
        accessories.map(async (a) => {
          const p = a.accessory;
          if (!p) return;

          try {
            const res = await variantService.getByProduct(p.id);
            const variants = res?.data?.data || [];

            if (variants.length > 0) {
              const minVariant = variants.reduce((min, v) =>
                !min || v.price < min.price ? v : min
              );

              const attributesText = minVariant.AttributeValues
                ? minVariant.AttributeValues.map(
                    (v) => `${v.Attribute?.name}: ${v.value}`
                  ).join(", ")
                : "";

              map[p.id] = { ...minVariant, attributesText };
            } else {
              map[p.id] = null;
            }
          } catch (error) {
            console.error("Error fetching variant:", p.id, error);
            map[p.id] = null;
          }
        })
      );

      setVariantMap(map);
    } catch (err) {
      console.error("Fetch variants failed", err);
    }
  }, [accessories]); // fetchVariants phụ thuộc vào accessories

  useEffect(() => {
    if (accessories.length > 0) {
      fetchVariants();
    }
  }, [accessories, fetchVariants]); // Đã thêm fetchVariants vào dependency array

  // ================= SCROLL =================
  const scroll = (direction) => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  const formatPrice = (price) =>
    price ? price.toLocaleString("vi-VN") + "₫" : "Chưa có giá";

  // ================= UI =================
  return (
    <Card
      title="Phụ kiện đi kèm"
      style={{ marginTop: 30, borderRadius: 12 }}
      extra={
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            icon={<LeftOutlined />}
            onClick={() => scroll("left")}
            shape="circle"
          />
          <Button
            icon={<RightOutlined />}
            onClick={() => scroll("right")}
            shape="circle"
          />
        </div>
      }
    >
      <div
        ref={scrollRef}
        style={{
          display: "flex",
          gap: 16,
          overflowX: "auto",
          paddingBottom: 10,
          scrollbarWidth: "none",
        }}
        className="hide-scrollbar"
      >
        {accessories.map((a) => {
          const p = a.accessory;
          if (!p) return null;

          const variant = variantMap[p.id];

          return (
            <div key={p.id} style={{ minWidth: 220, maxWidth: 220 }}>
              <Card hoverable styles={{ body: { padding: 12 } }}>
                
                {/* IMAGE */}
                <Link to={`/product/${p.slug}`}>
                  <div
                    style={{
                      height: 140,
                      borderRadius: 8,
                      overflow: "hidden",
                      background: "#f5f5f5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={`${API_URL}${p.thumbnail}`}
                      alt={p.name}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                </Link>

                {/* INFO */}
                <div style={{ marginTop: 12, height: 100 }}>
                  <Link to={`/product/${p.slug}`}>
                    <Text strong ellipsis={{ tooltip: p.name }}>
                      {p.name}
                    </Text>
                  </Link>

                  <Text
                    type="secondary"
                    style={{ fontSize: 12, display: "block", minHeight: 20 }}
                    ellipsis={{ tooltip: variant?.attributesText }}
                  >
                    {variant?.attributesText || "Tiêu chuẩn"}
                  </Text>

                  <Text
                    style={{
                      color: "#ff4d4f",
                      fontWeight: 700,
                      fontSize: 16,
                      display: "block",
                      marginTop: 4,
                    }}
                  >
                    {formatPrice(variant?.price)}
                  </Text>

                  <Tag color="blue" style={{ marginTop: 4 }}>
                    Phụ kiện
                  </Tag>
                </div>

                {/* BUTTON CHI TIẾT */}
                <Link to={`/product/${p.slug}`}>
                  <Button
                    block
                    type="primary"
                    icon={<EyeOutlined />}
                    style={{ marginTop: 12, borderRadius: 6 }}
                  >
                    Xem chi tiết
                  </Button>
                </Link>
              </Card>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default ProductAccessories;