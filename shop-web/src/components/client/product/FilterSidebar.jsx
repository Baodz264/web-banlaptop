import React, { useEffect, useState } from "react";
import { Card, Checkbox, Spin, Divider, Button, InputNumber, Tag, Flex } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

import categoryService from "../../../services/category.service";
import brandService from "../../../services/brand.service";

const MAX_PRICE = 50000000;

const FilterSidebar = ({ filters, setFilters }) => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFilterData();
  }, []);

  const fetchFilterData = async () => {
    setLoading(true);
    try {
      const [cateRes, brandRes] = await Promise.all([
        categoryService.getCategories(),
        brandService.getBrands(),
      ]);

      const cateData = cateRes?.data?.data?.items || cateRes?.data?.data || [];
      const brandData = brandRes?.data?.data?.items || brandRes?.data?.data || [];

      setCategories(cateData.map((i) => ({ label: i.name, value: Number(i.id) })));
      setBrands(brandData.map((i) => ({ label: i.name, value: Number(i.id) })));
    } catch (error) {
      console.error("Lỗi khi tải filter:", error);
    } finally {
      setLoading(false);
    }
  };

  const pricePresets = [
    { label: "Dưới 2tr", value: [0, 2000000] },
    { label: "2tr - 10tr", value: [2000000, 10000000] },
    { label: "10tr - 20tr", value: [10000000, 20000000] },
    { label: "Trên 20tr", value: [20000000, MAX_PRICE] },
  ];

  const handlePriceChange = (index, value) => {
    const newPrice = [...filters.price];
    newPrice[index] = value ?? 0;
    setFilters((prev) => ({ ...prev, price: newPrice }));
  };

  const handleReset = () => {
    setFilters({
      category: [],
      brand: [],
      price: [0, MAX_PRICE],
      sort: undefined,
      rating: [],
    });
  };

  // Định dạng số có dấu phẩy cho dễ nhìn
  const formatter = (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const parser = (value) => value.replace(/\$\s?|(,*)/g, "");

  return (
    <Card
      title="Bộ lọc"
      extra={
        <Button
          type="link"
          icon={<ReloadOutlined />}
          onClick={handleReset}
          size="small"
        >
          Thiết lập lại
        </Button>
      }
    >
      {loading ? (
        <Flex justify="center" align="center" style={{ minHeight: 200 }}>
          {/* Sửa tip -> description ở đây */}
          <Spin description="Đang tải dữ liệu..." />
        </Flex>
      ) : (
        <>
          <p><b>Danh mục</b></p>
          <Checkbox.Group
            style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            value={filters.category}
            options={categories}
            onChange={(val) => setFilters((prev) => ({ ...prev, category: val }))}
          />

          <Divider />

          <p><b>Thương hiệu</b></p>
          <Checkbox.Group
            style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            value={filters.brand}
            options={brands}
            onChange={(val) => setFilters((prev) => ({ ...prev, brand: val }))}
          />

          <Divider />

          <p><b>Khoảng giá</b></p>
          <Flex vertical gap="middle">
            <Flex gap="small">
              <InputNumber
                min={0}
                placeholder="Từ"
                formatter={formatter}
                parser={parser}
                value={filters.price[0]}
                onChange={(v) => handlePriceChange(0, v)}
                style={{ width: "100%" }}
              />
              <InputNumber
                min={0}
                placeholder="Đến"
                formatter={formatter}
                parser={parser}
                value={filters.price[1]}
                onChange={(v) => handlePriceChange(1, v)}
                style={{ width: "100%" }}
              />
            </Flex>

            <Flex wrap="wrap" gap="small">
              {pricePresets.map((p) => (
                <Tag.CheckableTag
                  key={p.label}
                  checked={
                    filters.price[0] === p.value[0] &&
                    filters.price[1] === p.value[1]
                  }
                  onChange={() => setFilters((prev) => ({ ...prev, price: p.value }))}
                >
                  {p.label}
                </Tag.CheckableTag>
              ))}
            </Flex>
          </Flex>
        </>
      )}
    </Card>
  );
};

export default FilterSidebar;