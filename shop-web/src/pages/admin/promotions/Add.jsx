import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import {
  Form,
  Input,
  Button,
  Card,
  Select,
  DatePicker,
  InputNumber,
  Table,
  Modal,
  Image,
  Tag
} from "antd";

import {
  PlusOutlined,
  ShoppingOutlined
} from "@ant-design/icons";

import promotionService from "../../../services/promotion.service";
import promotionItemService from "../../../services/promotionItem.service";
import productService from "../../../services/product.service";
import BrandService from "../../../services/brand.service";
import categoryService from "../../../services/category.service";

import { useToast } from "../../../context/ToastProvider";

const { Option } = Select;
const BASE_URL = "http://tbtshoplt.xyz";

const Add = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [applyType, setApplyType] = useState("product");

  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [open, setOpen] = useState(false);

  // ================= LOAD DATA =================

  const fetchProducts = useCallback(async () => {
    try {
      const res = await productService.getProducts({ limit: 100 });
      setProducts(res?.data?.data?.items || []);
    } catch {
      toast.error("Không tải được danh sách sản phẩm");
    }
  }, [toast]);

  const fetchBrands = useCallback(async () => {
    try {
      const res = await BrandService.getBrands({ limit: 100 });
      setBrands(res?.data?.data?.items || []);
    } catch {
      toast.error("Không tải được thương hiệu");
    }
  }, [toast]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await categoryService.getCategories({ limit: 100 });
      setCategories(res?.data?.data?.items || []);
    } catch {
      toast.error("Không tải được danh mục");
    }
  }, [toast]);

  useEffect(() => {
    fetchProducts();
    fetchBrands();
    fetchCategories();
  }, [fetchProducts, fetchBrands, fetchCategories]);

  // ================= SAVE =================

  const onFinish = async (values) => {
    try {
      setLoading(true);

      const res = await promotionService.createPromotion({
        ...values,
        start_date: values.start_date?.format("YYYY-MM-DD HH:mm:ss"),
        end_date: values.end_date?.format("YYYY-MM-DD HH:mm:ss")
      });

      const promotionId = res.data.data.id;

      // Xử lý lưu các Promotion Items
      if (applyType === "all") {
        await promotionItemService.createItem({
          promotion_id: promotionId,
          apply_type: "all"
        });
      }

      if (applyType === "product") {
        for (let id of selectedProducts) {
          await promotionItemService.createItem({
            promotion_id: promotionId,
            apply_type: "product",
            product_id: id
          });
        }
      }

      if (applyType === "brand") {
        for (let id of selectedBrands) {
          await promotionItemService.createItem({
            promotion_id: promotionId,
            apply_type: "brand",
            brand_id: id
          });
        }
      }

      if (applyType === "category") {
        for (let id of selectedCategories) {
          await promotionItemService.createItem({
            promotion_id: promotionId,
            apply_type: "category",
            category_id: id
          });
        }
      }

      toast.success("Tạo chương trình khuyến mãi thành công");
      navigate("/admin/promotions");
    } catch (err) {
      console.error(err);
      toast.error("Tạo chương trình khuyến mãi thất bại");
    } finally {
      setLoading(false);
    }
  };

  // ================= TABLE COLUMNS =================

  const productColumns = [
    { title: "ID", dataIndex: "id", width: 70 },
    {
      title: "Ảnh",
      dataIndex: "thumbnail",
      render: (thumb) => (thumb ? <Image src={`${BASE_URL}${thumb}`} width={50} /> : "N/A")
    },
    { title: "Tên sản phẩm", dataIndex: "name" },
    { title: "Thương hiệu", render: (r) => r.Brand?.name || "N/A" }
  ];

  const brandColumns = [
    { title: "ID", dataIndex: "id", width: 70 },
    {
      title: "Logo",
      dataIndex: "logo",
      render: (logo) => (logo ? <Image src={`${BASE_URL}${logo}`} width={50} /> : "N/A")
    },
    { title: "Tên thương hiệu", dataIndex: "name" }
  ];

  const categoryColumns = [
    { title: "ID", dataIndex: "id", width: 70 },
    {
      title: "Ảnh",
      dataIndex: "image",
      render: (img) => (img ? <Image src={`${BASE_URL}${img}`} width={50} /> : "N/A")
    },
    { title: "Tên danh mục", dataIndex: "name" }
  ];

  // ================= SWITCH TABLE =================

  const getTable = () => {
    const rowSelection = {
      product: {
        selectedRowKeys: selectedProducts,
        onChange: (keys) => setSelectedProducts(keys),
      },
      brand: {
        selectedRowKeys: selectedBrands,
        onChange: (keys) => setSelectedBrands(keys),
      },
      category: {
        selectedRowKeys: selectedCategories,
        onChange: (keys) => setSelectedCategories(keys),
      }
    };

    const config = {
      product: { columns: productColumns, data: products },
      brand: { columns: brandColumns, data: brands },
      category: { columns: categoryColumns, data: categories },
    };

    if (applyType === "all") return null;

    return (
      <Table
        rowKey="id"
        rowSelection={rowSelection[applyType]}
        columns={config[applyType].columns}
        dataSource={config[applyType].data}
        pagination={{ pageSize: 5 }}
      />
    );
  };

  return (
    <Card
      title="Tạo chương trình khuyến mãi"
      className="max-w-4xl mx-auto mt-10 shadow-md"
    >
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Tên chương trình"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên" }]}
        >
          <Input placeholder="Ví dụ: Giảm giá mùa hè" />
        </Form.Item>

        <Form.Item label="Mô tả chương trình" name="description">
          <Input.TextArea rows={3} />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Loại giảm giá"
            name="type"
            rules={[{ required: true, message: "Vui lòng chọn loại" }]}
          >
            <Select placeholder="Chọn loại">
              <Option value="percent">Giảm theo %</Option>
              <Option value="fixed">Giảm theo tiền</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Giá trị giảm"
            name="value"
            rules={[{ required: true, message: "Vui lòng nhập giá trị" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
        </div>

        <Form.Item label="Giới hạn lượt sử dụng" name="usage_limit">
          <InputNumber style={{ width: "100%" }} min={0} placeholder="Không giới hạn" />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item label="Ngày bắt đầu" name="start_date">
            <DatePicker showTime style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Ngày kết thúc" name="end_date">
            <DatePicker showTime style={{ width: "100%" }} />
          </Form.Item>
        </div>

        <Form.Item label="Áp dụng cho">
          <Select value={applyType} onChange={(v) => setApplyType(v)}>
            <Option value="all">Tất cả sản phẩm</Option>
            <Option value="product">Sản phẩm cụ thể</Option>
            <Option value="brand">Thương hiệu</Option>
            <Option value="category">Danh mục</Option>
          </Select>
        </Form.Item>

        {applyType !== "all" && (
          <Form.Item label="Dữ liệu áp dụng">
            <div className="flex flex-col gap-2">
              <Button
                className="w-fit"
                icon={<ShoppingOutlined />}
                onClick={() => setOpen(true)}
              >
                Chọn từ danh sách
              </Button>

              <div>
                {applyType === "product" && selectedProducts.length > 0 && (
                  <Tag color="blue">{selectedProducts.length} sản phẩm đã chọn</Tag>
                )}
                {applyType === "brand" && selectedBrands.length > 0 && (
                  <Tag color="green">{selectedBrands.length} thương hiệu đã chọn</Tag>
                )}
                {applyType === "category" && selectedCategories.length > 0 && (
                  <Tag color="orange">{selectedCategories.length} danh mục đã chọn</Tag>
                )}
              </div>
            </div>
          </Form.Item>
        )}

        <Button
          type="primary"
          htmlType="submit"
          icon={<PlusOutlined />}
          loading={loading}
          block
          size="large"
          style={{ marginTop: 20 }}
        >
          Tạo chương trình khuyến mãi
        </Button>
      </Form>

      <Modal
        open={open}
        width={900}
        title="Chọn dữ liệu áp dụng"
        onCancel={() => setOpen(false)}
        footer={[
          <Button key="submit" type="primary" onClick={() => setOpen(false)}>
            Xác nhận
          </Button>,
        ]}
      >
        {getTable()}
      </Modal>
    </Card>
  );
};

export default Add;