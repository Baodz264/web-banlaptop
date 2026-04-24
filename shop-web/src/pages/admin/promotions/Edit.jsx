import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

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
  Tag,
  Row,
  Col,
  Popconfirm,
} from "antd";

import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

import dayjs from "dayjs";

import promotionService from "../../../services/promotion.service";
import promotionItemService from "../../../services/promotionItem.service";
import productService from "../../../services/product.service";
import BrandService from "../../../services/brand.service";
import categoryService from "../../../services/category.service";

import { useToast } from "../../../context/ToastProvider";

const { Option } = Select;
const BASE_URL = "tbtshoplt.xyz";

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [form] = Form.useForm();

  const [items, setItems] = useState([]);
  const [applyType, setApplyType] = useState("product");

  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [open, setOpen] = useState(false);

  // ================= FETCH FUNCTIONS =================
  
  // Bọc fetchData trong useCallback để tránh re-creation và lỗi dependency
  const fetchData = useCallback(async () => {
    try {
      const res = await promotionService.getPromotionById(id);
      const data = res.data.data;

      form.setFieldsValue({
        ...data,
        start_date: data.start_date ? dayjs(data.start_date) : null,
        end_date: data.end_date ? dayjs(data.end_date) : null,
      });

      const resItems = await promotionItemService.getItems({
        promotion_id: id,
      });

      setItems(resItems.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Không tải được promotion");
    }
  }, [id, form, toast]);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await productService.getProducts({ limit: 100 });
      setProducts(res?.data?.data?.items || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchBrands = useCallback(async () => {
    try {
      const res = await BrandService.getBrands({ limit: 100 });
      setBrands(res?.data?.data?.items || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await categoryService.getCategories({ limit: 100 });
      setCategories(res?.data?.data?.items || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  // Giờ đây mảng dependency đã đầy đủ và an toàn
  useEffect(() => {
    fetchData();
    fetchProducts();
    fetchBrands();
    fetchCategories();
  }, [fetchData, fetchProducts, fetchBrands, fetchCategories]);

  // ================= UPDATE =================
  const onFinish = async (values) => {
    try {
      await promotionService.updatePromotion(id, {
        ...values,
        start_date: values.start_date?.format("YYYY-MM-DD"),
        end_date: values.end_date?.format("YYYY-MM-DD"),
      });

      toast.success("Cập nhật thành công");
      navigate("/admin/promotions");
    } catch {
      toast.error("Cập nhật thất bại");
    }
  };

  // ================= ADD ITEM =================
  const handleAddItems = async () => {
    try {
      if (applyType === "product") {
        await Promise.all(
          selectedProducts.map((pid) =>
            promotionItemService.createItem({
              promotion_id: id,
              apply_type: "product",
              product_id: pid,
            })
          )
        );
      }

      if (applyType === "brand") {
        await Promise.all(
          selectedBrands.map((bid) =>
            promotionItemService.createItem({
              promotion_id: id,
              apply_type: "brand",
              brand_id: bid,
            })
          )
        );
      }

      if (applyType === "category") {
        await Promise.all(
          selectedCategories.map((cid) =>
            promotionItemService.createItem({
              promotion_id: id,
              apply_type: "category",
              category_id: cid,
            })
          )
        );
      }

      toast.success("Thêm item thành công");
      setOpen(false);

      // reset chọn
      setSelectedProducts([]);
      setSelectedBrands([]);
      setSelectedCategories([]);

      fetchData(); // Gọi lại để refresh bảng
    } catch (err) {
      console.error(err);
      toast.error("Thêm thất bại");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (itemId) => {
    try {
      await promotionItemService.deleteItem(itemId);
      setItems((prev) => prev.filter((i) => i.id !== itemId));
      toast.success("Xóa thành công");
    } catch {
      toast.error("Xóa thất bại");
    }
  };

  // ================= HELPER =================
  const getImage = (r) => {
    const path = r.Product?.thumbnail || r.Brand?.logo || r.Category?.image;
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${BASE_URL}${path}`;
  };

  const getName = (r) => {
    return (
      r.Product?.name || r.Brand?.name || r.Category?.name || "Tất cả sản phẩm"
    );
  };

  const getId = (r) => {
    return r.product_id || r.brand_id || r.category_id || "-";
  };

  // ================= TABLE ITEM =================
  const columns = [
    {
      title: "Loại",
      dataIndex: "apply_type",
      render: (v) => {
        const map = {
          product: { color: "blue", text: "Sản phẩm" },
          brand: { color: "green", text: "Thương hiệu" },
          category: { color: "purple", text: "Danh mục" },
          all: { color: "gold", text: "Tất cả" },
        };
        return <Tag color={map[v]?.color}>{map[v]?.text}</Tag>;
      },
    },
    {
      title: "Ảnh",
      render: (r) => {
        const img = getImage(r);
        if (!img) return "N/A";
        return (
          <Image
            src={img}
            width={50}
            height={50}
            style={{ objectFit: "cover", borderRadius: 6 }}
          />
        );
      },
    },
    {
      title: "Tên",
      render: (r) => getName(r),
    },
    {
      title: "ID",
      render: (r) => getId(r),
    },
    {
      title: "Hành động",
      render: (r) => (
        <Popconfirm title="Xóa item?" onConfirm={() => handleDelete(r.id)}>
          <Button danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  // ================= TABLE SELECT =================
  const getTable = () => {
    if (applyType === "product") {
      return (
        <Table
          rowKey="id"
          pagination={{ pageSize: 5 }}
          rowSelection={{
            selectedRowKeys: selectedProducts,
            onChange: setSelectedProducts,
          }}
          dataSource={products}
          columns={[
            {
              title: "Ảnh",
              dataIndex: "thumbnail",
              render: (img) =>
                img ? <Image src={`${BASE_URL}${img}`} width={50} /> : "N/A",
            },
            { title: "Tên", dataIndex: "name" },
          ]}
        />
      );
    }

    if (applyType === "brand") {
      return (
        <Table
          rowKey="id"
          pagination={{ pageSize: 5 }}
          rowSelection={{
            selectedRowKeys: selectedBrands,
            onChange: setSelectedBrands,
          }}
          dataSource={brands}
          columns={[
            {
              title: "Logo",
              dataIndex: "logo",
              render: (img) =>
                img ? <Image src={`${BASE_URL}${img}`} width={50} /> : "N/A",
            },
            { title: "Tên", dataIndex: "name" },
          ]}
        />
      );
    }

    if (applyType === "category") {
      return (
        <Table
          rowKey="id"
          pagination={{ pageSize: 5 }}
          rowSelection={{
            selectedRowKeys: selectedCategories,
            onChange: setSelectedCategories,
          }}
          dataSource={categories}
          columns={[
            {
              title: "Ảnh",
              dataIndex: "image",
              render: (img) =>
                img ? <Image src={`${BASE_URL}${img}`} width={50} /> : "N/A",
            },
            { title: "Tên", dataIndex: "name" },
          ]}
        />
      );
    }
  };

  return (
    <Card title="Chỉnh sửa Promotion" className="max-w-5xl mx-auto mt-10">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={20}>
          <Col span={12}>
            <Form.Item name="name" label="Tên">
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="type" label="Loại">
              <Select>
                <Option value="percent">%</Option>
                <Option value="fixed">Tiền</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="description" label="Mô tả">
          <Input.TextArea />
        </Form.Item>

        <Row gutter={20}>
          <Col span={8}>
            <Form.Item name="value" label="Giá trị">
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="start_date" label="Start">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="end_date" label="End">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="status" label="Trạng thái">
          <Select>
            <Option value={1}>Active</Option>
            <Option value={0}>Inactive</Option>
          </Select>
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Lưu
        </Button>
      </Form>

      {/* ITEM LIST */}
      <Card
        title="Danh sách áp dụng"
        style={{ marginTop: 30 }}
        extra={
          <Button icon={<PlusOutlined />} onClick={() => setOpen(true)}>
            Thêm item
          </Button>
        }
      >
        <Table rowKey="id" columns={columns} dataSource={items} />
      </Card>

      {/* MODAL */}
      <Modal
        title="Thêm đối tượng áp dụng"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleAddItems}
        width={900}
      >
        <Select
          value={applyType}
          onChange={setApplyType}
          style={{ width: 200, marginBottom: 10 }}
        >
          <Option value="product">Product</Option>
          <Option value="brand">Brand</Option>
          <Option value="category">Category</Option>
        </Select>

        {getTable()}
      </Modal>
    </Card>
  );
};

export default Edit;