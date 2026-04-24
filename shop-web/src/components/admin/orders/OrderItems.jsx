import React from "react";
import { Card, Table, Image, Tag, Typography } from "antd";

const { Text } = Typography;
const API_URL = "http://tbtshoplt.xyz";

const OrderItems = ({ items = [] }) => {

  // ===== FORMAT GIÁ =====
  const formatPrice = (v) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(v || 0));

  // ===== LẤY ATTRIBUTE =====
  const renderAttributes = (item) => {
    const variant = item?.Variant || item?.variant || item;
    const attrs = variant?.AttributeValues || variant?.attribute_values || item?.AttributeValues || [];
    if (!attrs || attrs.length === 0) return null;

    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: 4 }}>
        {attrs.map((a, idx) => {
          const label = a?.Attribute?.name || a?.attribute?.name || "Thuộc tính";
          const value = a?.value || "N/A";
          return (
            <Tag key={idx} color="blue" style={{ fontSize: 10, margin: 0, borderRadius: 4 }}>
              {label}: {value}
            </Tag>
          );
        })}
      </div>
    );
  };

  // ===== LẤY ẢNH =====
  const getImage = (record) => {
    // 👉 COMBO
    if (record?.bundle) {
      let img = record?.product_thumbnail || record?.bundle?.thumbnail;

      // Nếu combo không có thumbnail, lấy ảnh sản phẩm đầu tiên
      if (!img && Array.isArray(record.bundle.bundleItems) && record.bundle.bundleItems.length > 0) {
        const firstItem = record.bundle.bundleItems[0];
        const variant = firstItem?.variant || firstItem?.Variant;
        const product = variant?.Product || firstItem?.Product;
        img =
          variant?.image ||
          product?.thumbnail ||
          firstItem?.product_thumbnail ||
          firstItem?.image ||
          firstItem?.thumbnail;
      }

      if (!img) return "https://placehold.co/60x60?text=Combo";

      const cleanPath = img.startsWith("/") ? img.substring(1) : img;
      return img.startsWith("http") ? img : `${API_URL}/${cleanPath}`;
    }

    // 👉 PRODUCT
    const product = record?.Variant?.Product;
    const rawImg =
      record?.product_thumbnail ||
      record?.image ||
      record?.thumbnail ||
      record?.Variant?.image ||
      record?.Variant?.Product?.thumbnail ||
      product?.thumbnail ||
      record?.product?.image;

    if (!rawImg) return "https://placehold.co/60x60?text=No+Image";
    const cleanPath = rawImg.startsWith("/") ? rawImg.substring(1) : rawImg;
    return rawImg.startsWith("http") ? rawImg : `${API_URL}/${cleanPath}`;
  };

  // ===== COLUMNS =====
  const columns = [
    {
      title: "Hình ảnh",
      render: (_, record) => (
        <Image
          src={getImage(record)}
          width={60}
          height={60}
          style={{ objectFit: "cover", borderRadius: 8 }}
        />
      ),
    },
    {
      title: "Tên sản phẩm",
      render: (_, record) => {
        const isCombo = !!record.bundle;
        const product = record?.Variant?.Product;
        const variant = record?.Variant;

        return (
          <>
            {isCombo && (
              <>
                <Text strong style={{ color: "#722ed1" }}>
                  🎁 {record.product_name || record.bundle.name}
                </Text>
                <br />
                <Tag color="purple">Combo</Tag>
              </>
            )}
            {!isCombo && (
              <>
                <Text strong>{record.product_name || product?.name}</Text>
                <div style={{ marginTop: 4 }}>{renderAttributes(variant)}</div>
              </>
            )}
          </>
        );
      },
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      align: "right",
      render: (v) => <Text>{formatPrice(v)}</Text>,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      align: "center",
      render: (q) => <Text strong>x{q}</Text>,
    },
    {
      title: "Thành tiền",
      render: (_, record) => (
        <Text strong style={{ color: "red" }}>{formatPrice(record.total_price)}</Text>
      ),
    },
  ];

  // ===== EXPAND COMBO =====
  const expandedRowRender = (record) => {
    if (!record.bundle) return null;
    const bundleItems = record.bundle.bundleItems || [];

    return (
      <div style={{ paddingLeft: 20 }}>
        {bundleItems.map((item, index) => {
          const variant = item?.variant || item?.Variant;
          const product = variant?.Product || item?.Product;

          // Lấy ảnh sản phẩm con
          let rawImg =
            item?.product_thumbnail ||
            item?.image ||
            item?.thumbnail ||
            variant?.image ||
            product?.thumbnail;

          if (!rawImg) rawImg = "https://placehold.co/40x40";
          const cleanPath = rawImg.startsWith("/") ? rawImg.substring(1) : rawImg;
          const img = rawImg.startsWith("http") ? rawImg : `${API_URL}/${cleanPath}`;

          return (
            <div
              key={`${variant?.id || "no-id"}-${index}`}
              style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}
            >
              <Image
                src={img}
                width={40}
                height={40}
                style={{ objectFit: "cover", borderRadius: 6 }}
              />
              <div>
                <Text>{product?.name || item?.product_name || "Sản phẩm"}</Text>
                {renderAttributes(variant)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Card title="📦 Sản phẩm trong đơn hàng" style={{ marginTop: 20 }}>
      <Table
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={items}
        pagination={false}
        expandable={{
          expandedRowRender,
          rowExpandable: (record) => !!record.bundle,
        }}
      />
    </Card>
  );
};

export default OrderItems;
