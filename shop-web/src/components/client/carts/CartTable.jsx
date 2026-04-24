import React, { useState, useMemo } from "react";
import {
  Table,
  InputNumber,
  Button,
  Popconfirm,
  Typography,
  Tag,
} from "antd";
import { DeleteOutlined, GiftOutlined } from "@ant-design/icons";
import { useCart } from "../../../context/CartContext";
import CartItemProduct from "./CartItemProduct";
import { useToast } from "../../../context/ToastProvider";

const { Text } = Typography;

const CartTable = ({ onSelectedChange }) => {
  const {
    items,
    bundles,
    loading,
    updateItem,
    deleteItem,
    getFinalPrice,
  } = useCart();

  const toast = useToast();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // ===================== DATA SOURCE =====================
  const dataSource = useMemo(() => {
    const normalItems = (items || []).map((item) => ({
      ...item,
      rowKey: `item-${item.id}`,
      isComboGroup: false,
    }));

    const comboGroups = (bundles || []).map((b) => ({
      ...b,
      rowKey: `bundle-${b.cart_item_id || b.id}`,
      isComboGroup: true,
      comboItems: (b.comboItems || []).map((ci) => ({
        ...ci,
        Product: {
          name: ci.name || ci.Product?.name,
          thumbnail: ci.thumbnail || ci.Product?.thumbnail,
        },
        Variant: {
          image: ci.Variant?.image || ci.thumbnail,
          price: Number(ci.price || ci.Variant?.price || 0),
        },
        quantity: ci.quantity || 1, // chỉ để hiển thị
      })),
      name: b.name || "Combo ưu đãi",
      quantity: b.quantity || 1, // số lượng combo
    }));

    return [...normalItems, ...comboGroups];
  }, [items, bundles]);

  // ===================== SELECTION =====================
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys, selectedRows) => {
      setSelectedRowKeys(keys);
      if (onSelectedChange) onSelectedChange(selectedRows);
    },
  };

  // ===================== NORMAL PRODUCT =====================
  const getNormalizedProduct = (item) => {
    const product = item.Product || item.Variant?.Product || item;
    return {
      ...product,
      Variant: item.Variant,
      price: Number(
        item.Variant?.price || product.price || item.price || 0
      ),
    };
  };

  // ===================== CALCULATE COMBO =====================
  const calculateBundlePrice = (record) => {
    const items = record.comboItems || [];

    // 🔥 FIX: KHÔNG nhân ci.quantity nữa
    const totalOriginal = items.reduce(
      (sum, i) =>
        sum + Number(i.Variant?.price || i.price || 0),
      0
    );

    let finalPrice = totalOriginal;
    const discountVal = Number(record.discount_value || 0);

    if (record.discount_type === "percent") {
      finalPrice -= (totalOriginal * discountVal) / 100;
    } else if (record.discount_type === "fixed") {
      finalPrice -= discountVal;
    }

    finalPrice = Math.max(finalPrice, 0);

    return {
      totalOriginal,
      finalPrice, // 👉 giá 1 combo
    };
  };

  // ===================== TOTAL =====================
  const calculateRowTotal = (record) => {
    if (record.isComboGroup) {
      const { finalPrice } = calculateBundlePrice(record);
      return finalPrice * (record.quantity || 1); // ✅ chỉ nhân ở đây
    }

    return (
      getFinalPrice(getNormalizedProduct(record)) *
      (record.quantity || 1)
    );
  };

  // ===================== COLUMNS =====================
  const columns = [
    {
      title: "Sản phẩm",
      key: "product",
      render: (_, record) => <CartItemProduct item={record} />,
    },
    {
      title: "Đơn giá",
      key: "price",
      width: 180,
      render: (_, record) => {
        if (record.isComboGroup) {
          const { totalOriginal, finalPrice } =
            calculateBundlePrice(record);

          const unitPrice = finalPrice; // ✅ FIX

          return (
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Text strong style={{ color: "#1677ff" }}>
                {Math.round(unitPrice).toLocaleString()} đ
              </Text>

              {finalPrice < totalOriginal && (
                <Text delete type="secondary" style={{ fontSize: 12 }}>
                  {Math.round(totalOriginal).toLocaleString()} đ
                </Text>
              )}

              <Tag
                color="blue"
                icon={<GiftOutlined />}
                style={{ marginTop: 4, width: "fit-content" }}
              >
                {record.name}
              </Tag>
            </div>
          );
        }

        const final = getFinalPrice(getNormalizedProduct(record));

        return (
          <Text strong style={{ color: "#ff4d4f" }}>
            {Math.round(final).toLocaleString()} đ
          </Text>
        );
      },
    },
    {
      title: "Số lượng",
      key: "quantity",
      width: 120,
      render: (_, record) => (
        <InputNumber
          min={1}
          value={record.quantity || 1}
          onChange={async (val) => {
            if (!val || val < 1) return;
            try {
              await updateItem(record, val);
              toast.success("Cập nhật số lượng thành công");
            } catch (err) {
              console.error(err);
              toast.error("Cập nhật thất bại");
            }
          }}
        />
      ),
    },
    {
      title: "Thành tiền",
      key: "total",
      width: 150,
      render: (_, record) => (
        <Text type="danger" strong>
          {Math.round(calculateRowTotal(record)).toLocaleString()} đ
        </Text>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center",
      width: 80,
      render: (_, record) => (
        <Popconfirm
          title={
            record.isComboGroup ? "Xóa combo?" : "Xóa sản phẩm?"
          }
          onConfirm={async () => {
            try {
              await deleteItem(record);
              toast.success("Xóa thành công");
            } catch (err) {
              console.error(err);
              toast.error("Xóa thất bại");
            }
          }}
        >
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <Table
      rowSelection={rowSelection}
      dataSource={dataSource}
      columns={columns}
      rowKey="rowKey"
      loading={loading}
      pagination={false}
      locale={{ emptyText: "Giỏ hàng trống" }}
    />
  );
};

export default CartTable;
