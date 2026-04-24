import React, { useEffect, useState, useCallback } from "react";
import { Form, Select, Button } from "antd";
import { useNavigate } from "react-router-dom";

import { useToast } from "../../../context/ToastProvider";

import VoucherApplyService from "../../../services/voucherApply.service";
import productService from "../../../services/product.service";
import categoryService from "../../../services/category.service";
import VoucherService from "../../../services/voucher.service";

const { Option } = Select;

function VoucherApplyAdd() {
  const navigate = useNavigate();
  const toast = useToast();
  const [form] = Form.useForm();

  const [applyType, setApplyType] = useState("all");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [vouchers, setVouchers] = useState([]);

  /* ================= LOAD DATA FUNCTIONS ================= */

  const loadVouchers = useCallback(async () => {
    try {
      const res = await VoucherService.getVouchers({ limit: 1000 });
      setVouchers(res?.data?.data?.items || []);
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải danh sách voucher");
    }
  }, [toast]);

  const loadProducts = useCallback(async () => {
    try {
      const res = await productService.getProducts({ limit: 1000 });
      setProducts(res?.data?.data?.items || []);
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải danh sách sản phẩm");
    }
  }, [toast]);

  const loadCategories = useCallback(async () => {
    try {
      const res = await categoryService.getCategories({ limit: 1000 });
      setCategories(res?.data?.data?.items || []);
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải danh sách danh mục");
    }
  }, [toast]);

  /* ================= USE EFFECT ================= */

  useEffect(() => {
    loadVouchers();
    loadProducts();
    loadCategories();
  }, [loadVouchers, loadProducts, loadCategories]);

  /* ================= HANDLERS ================= */

  const handleApplyTypeChange = (value) => {
    setApplyType(value);
    // Reset các trường liên quan khi đổi loại áp dụng
    form.setFieldsValue({
      category_id: null,
      product_id: null,
    });
  };

  const onFinish = async (values) => {
    try {
      await VoucherApplyService.createVoucherApply(values);
      toast.success("Thêm cấu hình áp dụng voucher thành công");
      navigate("/admin/voucher-applies");
    } catch (error) {
      console.error(error);
      toast.error("Thêm cấu hình voucher thất bại");
    }
  };

  /* ================= RENDER ================= */

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>Thêm cấu hình áp dụng Voucher</h2>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* VOUCHER */}
        <Form.Item
          label="Voucher"
          name="voucher_id"
          rules={[{ required: true, message: "Vui lòng chọn voucher" }]}
        >
          <Select placeholder="Chọn voucher" showSearch optionFilterProp="children">
            {vouchers.map((voucher) => (
              <Option key={voucher.id} value={voucher.id}>
                {voucher.code} - {voucher.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* APPLY TYPE */}
        <Form.Item
          label="Loại áp dụng"
          name="apply_type"
          initialValue="all"
          rules={[{ required: true, message: "Vui lòng chọn loại áp dụng" }]}
        >
          <Select onChange={handleApplyTypeChange}>
            <Option value="all">Áp dụng cho tất cả</Option>
            <Option value="category">Theo danh mục</Option>
            <Option value="product">Theo sản phẩm</Option>
          </Select>
        </Form.Item>

        {/* CATEGORY (Hiển thị khi chọn loại category) */}
        {applyType === "category" && (
          <Form.Item
            label="Danh mục"
            name="category_id"
            rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
          >
            <Select placeholder="Chọn danh mục" showSearch optionFilterProp="children">
              {categories.map((cat) => (
                <Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {/* PRODUCT (Hiển thị khi chọn loại product) */}
        {applyType === "product" && (
          <Form.Item
            label="Sản phẩm"
            name="product_id"
            rules={[{ required: true, message: "Vui lòng chọn sản phẩm" }]}
          >
            <Select placeholder="Chọn sản phẩm" showSearch optionFilterProp="children">
              {products.map((p) => (
                <Option key={p.id} value={p.id}>
                  {p.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {/* BUTTON ACTIONS */}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Thêm cấu hình
          </Button>
          <Button 
            style={{ marginLeft: "8px" }} 
            onClick={() => navigate("/admin/voucher-applies")}
          >
            Hủy bỏ
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default VoucherApplyAdd;