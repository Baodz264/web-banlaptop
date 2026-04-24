import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Form, InputNumber, Button, Card, Select, DatePicker, Spin, Typography } from "antd";

import inventoryService from "../../../services/inventory.service";
import inventoryLogService from "../../../services/inventoryLog.service";
import productService from "../../../services/product.service";
import variantService from "../../../services/variant.service";
import supplierService from "../../../services/supplier.service";

import { useToast } from "../../../context/ToastProvider";

const { Text } = Typography;

const Add = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [products, setProducts] = useState([]);
  const [variants, setVariants] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingVariants, setLoadingVariants] = useState(false);
  const [selectedVariantPrice, setSelectedVariantPrice] = useState(null);

  // Sử dụng useCallback để tránh lỗi missing dependency nếu hàm được dùng ở nhiều nơi
  // Hoặc đơn giản là định nghĩa bên trong useEffect. Ở đây tôi dùng useCallback cho sạch sẽ.
  const fetchData = useCallback(async () => {
    try {
      const [productRes, supplierRes] = await Promise.all([
        productService.getProducts(),
        supplierService.getSuppliers(),
      ]);

      const productData =
        productRes.data?.data?.items || productRes.data?.data || [];
      const supplierData =
        supplierRes.data?.data?.items || supplierRes.data?.data || [];

      setProducts(Array.isArray(productData) ? productData : []);
      setSuppliers(Array.isArray(supplierData) ? supplierData : []);
    } catch (err) {
      console.error(err);
      toast.error("Không tải được dữ liệu ❌");
    }
  }, [toast]); // toast được thêm vào dependency của useCallback

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Bây giờ fetchData đã ổn định và có thể bỏ vào đây

  // Lấy variant khi chọn sản phẩm
  const loadVariants = async (product_id) => {
    if (!product_id) return setVariants([]);
    try {
      setLoadingVariants(true);
      const res = await variantService.getByProduct(product_id);
      const variantData = res.data?.data?.items || res.data?.data || [];
      setVariants(Array.isArray(variantData) ? variantData : []);
      setSelectedVariantPrice(null); // reset giá khi đổi sản phẩm
    } catch (err) {
      console.error(err);
      toast.error("Không tải được biến thể ❌");
    } finally {
      setLoadingVariants(false);
    }
  };

  // Khi chọn variant, lấy giá bán hiện tại
  const handleVariantChange = (variant_id) => {
    const variant = variants.find((v) => v.id === variant_id);
    if (variant) {
      setSelectedVariantPrice(variant.price);
    } else {
      setSelectedVariantPrice(null);
    }
  };

  // Submit form nhập kho
  const onFinish = async (values) => {
    try {
      setLoading(true);

      const importQuantity = values.quantity;

      // Kiểm tra tồn kho hiện tại
      const inventories = await inventoryService.getInventories({
        variant_id: values.variant_id,
      });

      const inventoryList =
        inventories.data?.data?.items || inventories.data?.data || [];

      if (Array.isArray(inventoryList) && inventoryList.length > 0) {
        const inventory = inventoryList[0];
        await inventoryService.updateInventory(inventory.id, {
          quantity: inventory.quantity + importQuantity,
          cost_price: values.cost_price,
        });
      } else {
        await inventoryService.createInventory({
          variant_id: values.variant_id,
          supplier_id: values.supplier_id || null,
          quantity: importQuantity,
          cost_price: values.cost_price,
          import_date: values.import_date
            ? values.import_date.format("YYYY-MM-DD")
            : null,
        });
      }

      // Cập nhật stock cho variant
      const selectedVariant = variants.find((v) => v.id === values.variant_id);
      const newStock = (selectedVariant?.stock || 0) + importQuantity;

      await variantService.update(values.variant_id, { stock: newStock });

      // Ghi log nhập kho
      await inventoryLogService.createLog({
        variant_id: values.variant_id,
        type: "import",
        quantity: importQuantity,
        note: "Nhập kho",
      });

      toast.success("Nhập kho thành công ✅");
      navigate("/admin/inventories");
    } catch (err) {
      console.error(err);
      toast.error("Nhập kho thất bại ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Nhập kho sản phẩm" className="max-w-xl mx-auto mt-10">
      <Form layout="vertical" onFinish={onFinish}>
        {/* Chọn sản phẩm */}
        <Form.Item
          label="Sản phẩm"
          name="product_id"
          rules={[{ required: true, message: "Vui lòng chọn sản phẩm" }]}
        >
          <Select
            showSearch
            optionFilterProp="label"
            placeholder="Chọn sản phẩm"
            onChange={loadVariants}
            options={(products || []).map((p) => ({
              value: p.id,
              label: p.name,
            }))}
          />
        </Form.Item>

        {/* Chọn biến thể */}
        <Form.Item
          label="Biến thể (SKU)"
          name="variant_id"
          rules={[{ required: true, message: "Vui lòng chọn biến thể" }]}
        >
          {loadingVariants ? (
            <Spin />
          ) : (
            <Select
              showSearch
              optionFilterProp="label"
              placeholder="Chọn biến thể"
              onChange={handleVariantChange}
              options={(variants || []).map((v) => ({
                value: v.id,
                label: `${v.sku} ${
                  v.AttributeValues && v.AttributeValues.length > 0
                    ? "- " +
                      v.AttributeValues
                        .map(
                          (attr) => `${attr.Attribute.name}:${attr.value}`
                        )
                        .join(", ")
                    : ""
                }`,
              }))}
            />
          )}
        </Form.Item>

        {/* Hiển thị giá bán hiện tại */}
        {selectedVariantPrice && (
          <div style={{ marginBottom: 16 }}>
            <Text type="secondary">Giá bán hiện tại: {selectedVariantPrice.toLocaleString()} VNĐ</Text>
          </div>
        )}

        {/* Nhà cung cấp */}
        <Form.Item label="Nhà cung cấp" name="supplier_id">
          <Select
            showSearch
            allowClear
            optionFilterProp="label"
            placeholder="Chọn nhà cung cấp"
            options={(suppliers || []).map((s) => ({
              value: s.id,
              label: s.name,
            }))}
          />
        </Form.Item>

        {/* Số lượng nhập */}
        <Form.Item
          label="Số lượng nhập"
          name="quantity"
          rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={1}
            placeholder="Nhập số lượng"
          />
        </Form.Item>

        {/* Giá nhập */}
        <Form.Item label="Giá nhập" name="cost_price">
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            placeholder="Nhập giá nhập"
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          />
        </Form.Item>

        {/* Ngày nhập */}
        <Form.Item label="Ngày nhập" name="import_date">
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading} block>
          Nhập kho
        </Button>
      </Form>
    </Card>
  );
};

export default Add;