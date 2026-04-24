import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, InputNumber, Button, Card, Select, DatePicker, Spin, Typography } from "antd";

import inventoryService from "../../../services/inventory.service";
import inventoryLogService from "../../../services/inventoryLog.service";
import variantService from "../../../services/variant.service";
import productService from "../../../services/product.service";
import supplierService from "../../../services/supplier.service";

import { useToast } from "../../../context/ToastProvider";
import moment from "moment";

const { Title, Text } = Typography;

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [form] = Form.useForm();

  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingVariants, setLoadingVariants] = useState(false);
  const [variant, setVariant] = useState(null);
  const [products, setProducts] = useState([]);
  const [variants, setVariants] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedVariantPrice, setSelectedVariantPrice] = useState(null);

  // Load variants của sản phẩm (Định nghĩa trước để dùng trong fetchInventory)
  const loadVariants = useCallback(async (product_id) => {
    if (!product_id) {
      setVariants([]);
      return;
    }
    try {
      setLoadingVariants(true);
      const res = await variantService.getByProduct(product_id);
      const variantData = res.data?.data?.items || res.data?.data || [];
      setVariants(Array.isArray(variantData) ? variantData : []);
    } catch (err) {
      console.error(err);
      toast.error("Không tải được biến thể ");
    } finally {
      setLoadingVariants(false);
    }
  }, [toast]);

  // Fetch sản phẩm và nhà cung cấp
  const fetchData = useCallback(async () => {
    try {
      const [productRes, supplierRes] = await Promise.all([
        productService.getProducts(),
        supplierService.getSuppliers(),
      ]);

      const productData = productRes.data?.data?.items || productRes.data?.data || [];
      const supplierData = supplierRes.data?.data?.items || supplierRes.data?.data || [];

      setProducts(Array.isArray(productData) ? productData : []);
      setSuppliers(Array.isArray(supplierData) ? supplierData : []);
    } catch (err) {
      console.error(err);
      toast.error("Không tải được dữ liệu sản phẩm hoặc nhà cung cấp ");
    }
  }, [toast]);

  // Fetch tồn kho và variant hiện tại
  const fetchInventory = useCallback(async () => {
    try {
      setLoading(true);
      const res = await inventoryService.getInventoryById(id);
      const data = res.data?.data;
      if (!data) throw new Error("Không tìm thấy tồn kho");

      setInventory(data);
      setVariant(data.Variant || null);

      // Set form default
      form.setFieldsValue({
        product_id: data.Variant?.product_id,
        variant_id: data.variant_id,
        supplier_id: data.supplier_id,
        quantity: data.quantity,
        cost_price: data.cost_price,
        import_date: data.import_date ? moment(data.import_date) : null,
      });

      setSelectedVariantPrice(data.Variant?.price || null);

      // Load variants của sản phẩm hiện tại
      if (data.Variant?.product_id) {
        await loadVariants(data.Variant.product_id);
      }
    } catch (err) {
      console.error(err);
      toast.error("Không tìm thấy tồn kho ");
      navigate("/admin/inventories");
    } finally {
      setLoading(false);
    }
  }, [id, form, loadVariants, navigate, toast]);

  useEffect(() => {
    fetchData();
    fetchInventory();
  }, [fetchData, fetchInventory]);

  // Khi thay đổi sản phẩm trên giao diện
  const handleProductChange = async (product_id) => {
    form.setFieldsValue({ variant_id: undefined });
    setSelectedVariantPrice(null);
    setVariant(null);
    await loadVariants(product_id);
  };

  // Khi chọn variant, lấy giá bán hiện tại
  const handleVariantChange = (variant_id) => {
    const v = variants.find((v) => v.id === variant_id);
    if (v) {
      setSelectedVariantPrice(v.price);
      setVariant(v);
    } else {
      setSelectedVariantPrice(null);
      setVariant(null);
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const oldQuantity = inventory.quantity;
      const newQuantity = values.quantity;
      const diff = newQuantity - oldQuantity;

      // Cập nhật Inventory
      await inventoryService.updateInventory(id, {
        variant_id: values.variant_id,
        supplier_id: values.supplier_id || null,
        quantity: newQuantity,
        cost_price: values.cost_price,
        import_date: values.import_date
          ? values.import_date.format("YYYY-MM-DD")
          : moment().format("YYYY-MM-DD"),
      });

      // Cập nhật stock cho Variant và ghi log nếu có thay đổi số lượng
      if (diff !== 0 && variant) {
        const newStock = (variant?.stock || 0) + diff;
        await variantService.update(variant.id, { stock: newStock });

        await inventoryLogService.createLog({
          variant_id: variant.id,
          type: "adjust",
          quantity: diff,
          note: "Điều chỉnh tồn kho",
        });
      }

      toast.success("Cập nhật tồn kho thành công ");
      navigate("/admin/inventories");
    } catch (err) {
      console.error(err);
      toast.error("Cập nhật thất bại ");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !inventory) {
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Card title="Điều chỉnh tồn kho" className="max-w-xl mx-auto mt-10">
      {variant && (
        <div style={{ marginBottom: 20, padding: "10px", background: "#f5f5f5", borderRadius: "8px" }}>
          <Title level={5}>{variant.Product?.name || "Thông tin sản phẩm"}</Title>
          <Text type="secondary">
            SKU: {variant.sku}{" "}
            {variant.AttributeValues && variant.AttributeValues.length > 0
              ? "- " +
                variant.AttributeValues
                  .map((attr) => `${attr.Attribute.name}:${attr.value}`)
                  .join(", ")
              : ""}
          </Text>
          <br />
          {selectedVariantPrice !== null && (
            <Text strong style={{ color: "#1890ff" }}>
              Giá bán hiện tại: {selectedVariantPrice.toLocaleString("vi-VN")} VNĐ
            </Text>
          )}
        </div>
      )}

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Sản phẩm"
          name="product_id"
          rules={[{ required: true, message: "Vui lòng chọn sản phẩm" }]}
        >
          <Select
            showSearch
            optionFilterProp="label"
            placeholder="Chọn sản phẩm"
            onChange={handleProductChange}
            options={products.map((p) => ({ value: p.id, label: p.name }))}
          />
        </Form.Item>

        <Form.Item
          label="Biến thể (SKU)"
          name="variant_id"
          rules={[{ required: true, message: "Vui lòng chọn biến thể" }]}
        >
          {loadingVariants ? (
            <Spin size="small" />
          ) : (
            <Select
              showSearch
              optionFilterProp="label"
              placeholder="Chọn biến thể"
              onChange={handleVariantChange}
              options={variants.map((v) => ({
                value: v.id,
                label: `${v.sku} ${
                  v.AttributeValues && v.AttributeValues.length > 0
                    ? "- " +
                      v.AttributeValues.map((attr) => `${attr.Attribute.name}:${attr.value}`).join(", ")
                    : ""
                }`,
              }))}
            />
          )}
        </Form.Item>

        <Form.Item label="Nhà cung cấp" name="supplier_id">
          <Select
            showSearch
            allowClear
            optionFilterProp="label"
            placeholder="Chọn nhà cung cấp"
            options={suppliers.map((s) => ({ value: s.id, label: s.name }))}
          />
        </Form.Item>

        <Form.Item
          label="Số lượng tồn kho"
          name="quantity"
          rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
        >
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>

        <Form.Item label="Giá nhập" name="cost_price">
          <InputNumber 
            style={{ width: "100%" }} 
            min={0} 
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          />
        </Form.Item>

        <Form.Item label="Ngày nhập" name="import_date">
          <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
        </Form.Item>

        <Button type="primary" htmlType="submit" block loading={loading} size="large">
          Lưu thay đổi
        </Button>
      </Form>
    </Card>
  );
};

export default Edit;