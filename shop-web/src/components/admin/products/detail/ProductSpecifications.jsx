import { useEffect, useState, useCallback } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Space
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined
} from "@ant-design/icons";

import productSpecificationService from "../../../../services/productSpecification.service";
import { useToast } from "../../../../context/ToastProvider";

const ProductSpecifications = ({ productId }) => {
  const toast = useToast();

  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form] = Form.useForm();

  const fetchData = useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    try {
      const res = await productSpecificationService.getByProduct(productId);
      const list = res?.data?.data || [];
      setData(Array.isArray(list) ? list : []);
    } catch (error) {
      toast.error("Không tải được thông số");
    } finally {
      setLoading(false);
    }
  }, [productId, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openAdd = () => {
    setEditing(null);
    form.resetFields();
    setOpen(true);
  };

  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue(record);
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      if (editing) {
        await productSpecificationService.update(editing.id, values);
        toast.success("Cập nhật thông số thành công");
      } else {
        await productSpecificationService.create({
          ...values,
          product_id: productId
        });
        toast.success("Thêm thông số thành công");
      }

      setOpen(false);
      form.resetFields();
      fetchData();
    } catch (error) {
      if (error?.errorFields) return;
      toast.error("Lưu thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (id) => {
    try {
      await productSpecificationService.delete(id);
      toast.success("Đã xoá thông số");
      fetchData();
    } catch (error) {
      toast.error("Xoá thất bại");
    }
  };

  const columns = [
    {
      title: "Nhóm",
      dataIndex: "spec_group",
      key: "spec_group",
    },
    {
      title: "Tên",
      dataIndex: "spec_name",
      key: "spec_name",
    },
    {
      title: "Giá trị",
      dataIndex: "spec_value",
      key: "spec_value",
    },
    {
      title: "Sắp xếp",
      dataIndex: "sort_order",
      key: "sort_order",
      width: 100
    },
    {
      title: "Thao tác",
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => openEdit(record)}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xoá?"
            onConfirm={() => remove(record.id)}
            okText="Xoá"
            cancelText="Hủy"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <Card
      title="Thông số kỹ thuật"
      style={{ marginTop: 24 }}
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openAdd}
        >
          Thêm thông số
        </Button>
      }
    >
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        pagination={false}
        loading={loading}
      />

      <Modal
        open={open}
        title={editing ? "Cập nhật thông số" : "Thêm thông số kỹ thuật"}
        onCancel={handleCancel}
        onOk={save}
        confirmLoading={submitting}
        // Đã sửa: Sử dụng destroyOnHidden thay vì destroyOnClose (deprecated)
        destroyOnHidden
        // forceRender đảm bảo Form kết nối với instance useForm ngay khi component mount
        forceRender 
      >
        <Form
          form={form}
          layout="vertical"
          name="product_spec_form"
          initialValues={{ sort_order: 0 }}
        >
          <Form.Item
            label="Nhóm (VD: Màn hình, CPU...)"
            name="spec_group"
          >
            <Input placeholder="Nhập nhóm thông số" />
          </Form.Item>

          <Form.Item
            label="Tên thông số"
            name="spec_name"
            rules={[{ required: true, message: 'Vui lòng nhập tên thông số' }]}
          >
            <Input placeholder="VD: Độ phân giải" />
          </Form.Item>

          <Form.Item
            label="Giá trị"
            name="spec_value"
            rules={[{ required: true, message: 'Vui lòng nhập giá trị' }]}
          >
            <Input placeholder="VD: 1920 x 1080" />
          </Form.Item>

          <Form.Item
            label="Thứ tự hiển thị"
            name="sort_order"
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ProductSpecifications;