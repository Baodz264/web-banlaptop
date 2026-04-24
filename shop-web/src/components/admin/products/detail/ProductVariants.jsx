import { useState, useEffect, useCallback } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  InputNumber,
  Select,
  Popconfirm,
  Upload,
  Image,
  Space,
  Tag,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import variantService from "../../../../services/variant.service";
import variantValueService from "../../../../services/variantValue.service";
import attributeService from "../../../../services/attribute.service";
import attributeValueService from "../../../../services/attributeValue.service";

import { useToast } from "../../../../context/ToastProvider";

const API_URL = "http://tbtshoplt.xyz";

const ProductVariants = ({ productId, variants, reload }) => {
  const toast = useToast();
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const [attributes, setAttributes] = useState([]);
  const [attributeValues, setAttributeValues] = useState([]);
  const [groupValues, setGroupValues] = useState({});

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  // ================= LOAD FUNCTIONS =================
  const loadAttributes = useCallback(async () => {
    try {
      const res = await attributeService.getAll();
      setAttributes(res.data?.data || []);
    } catch {
      toast.error("Không thể tải danh sách thuộc tính (Attributes)");
    }
  }, [toast]);

  const loadValues = useCallback(async () => {
    try {
      const res = await attributeValueService.getAll();
      setAttributeValues(res.data?.data || []);
    } catch {
      toast.error("Không thể tải giá trị thuộc tính");
    }
  }, [toast]);

  // ================= USE EFFECTS =================
  useEffect(() => {
    loadAttributes();
    loadValues();
  }, [loadAttributes, loadValues]);

  useEffect(() => {
    const group = {};
    attributeValues.forEach((v) => {
      if (!group[v.attribute_id]) group[v.attribute_id] = [];
      group[v.attribute_id].push(v);
    });
    setGroupValues(group);
  }, [attributeValues]);

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // ================= SAVE =================
  const saveVariant = async (values) => {
    if (loading) return;

    try {
      setLoading(true);
      const attribute_value_ids = Object.values(values.attributes || {});
      let variant_id;

      const payloadData = {
        product_id: productId,
        price: values.price,
        stock: values.stock,
        weight: values.weight,
        image: file,
      };

      if (editing) {
        await variantService.update(editing.id, payloadData);
        variant_id = editing.id;
        await variantValueService.removeByVariant(variant_id);
      } else {
        const res = await variantService.create(payloadData);
        variant_id = res.data?.data?.id || res.data?.id;
      }

      if (!variant_id) {
        toast.error("Không xác định được ID biến thể");
        return;
      }

      for (const v of attribute_value_ids) {
        if (!v) continue;
        await variantValueService.create({
          variant_id,
          attribute_value_id: v,
        });
      }

      toast.success(editing ? "Cập nhật biến thể thành công" : "Thêm biến thể thành công");
      handleCloseModal();
      reload();
    } catch (err) {
      console.error(err);
      toast.error("Đã có lỗi xảy ra trong quá trình xử lý");
    } finally {
      setLoading(false);
    }
  };

  // ================= ACTIONS =================
  const openEdit = async (record) => {
    try {
      setEditing(record);
      setModal(true); 

      const res = await variantValueService.getByVariantId(record.id);
      const values = res.data?.data || [];

      const attrs = {};
      values.forEach((v) => {
        const attribute_id = v.AttributeValue?.attribute_id;
        if (attribute_id) {
          attrs[attribute_id] = v.attribute_value_id;
        }
      });

      setPreview(record.image ? API_URL + record.image : null);
      setFile(null);

      form.setFieldsValue({
        price: record.price,
        stock: record.stock,
        weight: record.weight,
        attributes: attrs,
      });
    } catch {
      toast.error("Không thể tải thông tin chi tiết biến thể");
    }
  };

  const deleteVariant = async (id) => {
    try {
      await variantService.remove(id);
      toast.success("Đã xóa biến thể");
      reload();
    } catch {
      toast.error("Xóa biến thể thất bại");
    }
  };

  const handleCloseModal = () => {
    setModal(false);
    setEditing(null);
    setFile(null);
    setPreview(null);
    form.resetFields();
  };

  // ================= TABLE COLUMNS =================
  const columns = [
    {
      title: "STT",
      key: "index",
      width: 60,
      align: "center",
      render: (_, __, index) => index + 1, // Tạo số thứ tự dựa trên index của mảng
    },
    {
      title: "Ảnh",
      render: (_, r) =>
        r.image ? (
          <Image
            src={API_URL + r.image}
            width={60}
            height={60}
            style={{ objectFit: "cover", borderRadius: 4 }}
          />
        ) : (
          <span style={{ color: "#999" }}>Chưa có ảnh</span>
        ),
    },
    {
      title: "Giá bán",
      dataIndex: "price",
      render: (val) => `${val?.toLocaleString()} đ`,
    },
    {
      title: "Kho",
      dataIndex: "stock",
      render: (val) => val ?? 0,
    },
    {
      title: "Trọng lượng",
      dataIndex: "weight",
      render: (val) => `${val} kg`,
    },
    {
      title: "Thuộc tính",
      render: (_, r) => (
        <Space wrap>
          {r.AttributeValues?.map((v, index) => (
            <Tag color="blue" key={index}>
              {v.Attribute?.name}: {v.value}
            </Tag>
          )) || "Mặc định"}
        </Space>
      ),
    },
    {
      title: "Thao tác",
      width: 100,
      render: (_, r) => (
        <Space size="middle">
          <EditOutlined
            style={{ color: "#1890ff", cursor: "pointer", fontSize: 16 }}
            onClick={() => openEdit(r)}
          />
          <Popconfirm
            title="Xác nhận xóa?"
            description="Bạn có chắc chắn muốn xóa biến thể này không?"
            onConfirm={() => deleteVariant(r.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <DeleteOutlined style={{ color: "#ff4d4f", cursor: "pointer", fontSize: 16 }} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Danh sách biến thể sản phẩm"
      style={{ marginTop: 20 }}
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditing(null);
            setFile(null);
            setPreview(null);
            form.resetFields();
            setModal(true);
          }}
        >
          Thêm biến thể
        </Button>
      }
    >
      <Table rowKey="id" columns={columns} dataSource={variants} pagination={false} />

      <Modal
        open={modal}
        title={editing ? "Cập nhật biến thể" : "Thêm biến thể mới"}
        onCancel={handleCloseModal}
        footer={null}
        // FIX: Xử lý cảnh báo focusTriggerAfterClose theo chuẩn mới
        focusable={{ focusTriggerAfterClose: false }}
        // FIX: Thay thế destroyOnClose bằng destroyOnHidden để hết cảnh báo
        destroyOnHidden
      >
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={saveVariant}
          preserve={false} 
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Form.Item
              label="Giá bán (VNĐ)"
              name="price"
              rules={[{ required: true, message: "Vui lòng nhập giá" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>

            <Form.Item label="Số lượng kho" name="stock">
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
          </div>

          <Form.Item
            label="Trọng lượng (kg)"
            name="weight"
            rules={[{ required: true, message: "Vui lòng nhập trọng lượng" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0.01} step={0.1} />
          </Form.Item>

          <Form.Item label="Hình ảnh sản phẩm">
            <Upload
              beforeUpload={(file) => {
                setFile(file);
                const objectUrl = URL.createObjectURL(file);
                setPreview(objectUrl);
                return false;
              }}
              maxCount={1}
              showUploadList={false}
            >
              <Button icon={<PlusOutlined />}>Chọn tệp ảnh</Button>
            </Upload>

            {preview && (
              <div style={{ marginTop: 10 }}>
                <Image
                  src={preview}
                  width={100}
                  height={100}
                  style={{ objectFit: "cover", borderRadius: 8 }}
                />
              </div>
            )}
          </Form.Item>

          <h4 style={{ marginBottom: 16, marginTop: 8, borderTop: "1px solid #f0f0f0", paddingTop: 16 }}>
            Thông số thuộc tính
          </h4>

          {attributes.map((attr) => (
            <Form.Item key={attr.id} label={attr.name} name={["attributes", attr.id]}>
              <Select placeholder={`Chọn ${attr.name.toLowerCase()}`} allowClear>
                {groupValues[attr.id]?.map((v) => (
                  <Select.Option key={v.id} value={v.id}>
                    {v.value}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          ))}

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button onClick={handleCloseModal}>Hủy bỏ</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editing ? "Cập nhật" : "Lưu biến thể"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ProductVariants;