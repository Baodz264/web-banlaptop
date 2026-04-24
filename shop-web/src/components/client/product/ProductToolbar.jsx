import { Select } from "antd";

const ProductToolbar = ({ setFilters }) => {
  return (
    <div
      style={{
        marginBottom: 20,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h3>Sản phẩm</h3>

      <Select
        placeholder="Sắp xếp"
        style={{ width: 200 }}
        allowClear
        onChange={(value) =>
          setFilters((prev) => ({ ...prev, sort: value }))
        }
        options={[
          { label: "Mới nhất", value: "new" },
          { label: "Giá thấp → cao", value: "price_asc" },
          { label: "Giá cao → thấp", value: "price_desc" },
          { label: "Đánh giá cao → thấp", value: "rating_desc" },
          { label: "Đánh giá thấp → cao", value: "rating_asc" },
        ]}
      />
    </div>
  );
};

export default ProductToolbar;
