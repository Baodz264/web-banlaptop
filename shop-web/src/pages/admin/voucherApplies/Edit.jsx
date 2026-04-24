import React, { useEffect, useState, useCallback } from "react";
import { Form, Select, Button } from "antd";
import { useNavigate, useParams } from "react-router-dom";

import { useToast } from "../../../context/ToastProvider";

import VoucherApplyService from "../../../services/voucherApply.service";
import productService from "../../../services/product.service";
import categoryService from "../../../services/category.service";
import VoucherService from "../../../services/voucher.service";

const { Option } = Select;

function VoucherApplyEdit() {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [applyType, setApplyType] = useState("all");

  const [vouchers, setVouchers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  /* ================= LOAD DATA FUNCTIONS (Wrapped in useCallback) ================= */

  const loadData = useCallback(async () => {
    try {
      const res = await VoucherApplyService.getVoucherApplyById(id);
      const data = res?.data?.data;
      if (data) {
        form.setFieldsValue(data);
        setApplyType(data.apply_type);
      }
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải dữ liệu cấu hình voucher");
    }
  }, [id, form, toast]);

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
    loadData();
    loadVouchers();
    loadProducts();
    loadCategories();
  }, [loadData, loadVouchers, loadProducts, loadCategories]);

  /* ================= APPLY TYPE CHANGE ================= */

  const handleApplyTypeChange = (value) => {
    setApplyType(value);
    form.setFieldsValue({
      product_id: null,
      category_id: null,
    });
  };

  /* ================= SUBMIT ================= */

  const onFinish = async (values) => {
    try {
      await VoucherApplyService.updateVoucherApply(id, values);
      toast.success("Cập nhật cấu hình voucher thành công");
      navigate("/admin/voucher-applies");
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật cấu hình voucher thất bại");
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>Sửa cấu hình áp dụng Voucher</h2>

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
          rules={[{ required: true, message: "Vui lòng chọn loại áp dụng" }]}
        >
          <Select onChange={handleApplyTypeChange}>
            <Option value="all">Áp dụng cho tất cả</Option>
            <Option value="category">Theo danh mục</Option>
            <Option value="product">Theo sản phẩm</Option>
          </Select>
        </Form.Item>

        {/* CATEGORY */}
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

        {/* PRODUCT */}
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

        {/* BUTTON */}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Cập nhật
          </Button>
          <Button 
            style={{ marginLeft: 8 }} 
            onClick={() => navigate("/admin/voucher-applies")}
          >
            Hủy
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default VoucherApplyEdit;