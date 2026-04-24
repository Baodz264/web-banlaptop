import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Form,
  Input,
  Button,
  Upload,
  Card,
  Skeleton,
  Divider,
  Modal,
  Table,
  Space,
  Tag,
  Popconfirm,
} from "antd";

import {
  UploadOutlined,
  SaveOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import userService from "../../../services/user.service";
import AddressService from "../../../services/address.service";
import { useToast } from "../../../context/ToastProvider";

const API_URL = "http://tbtshoplt.xyz";

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [form] = Form.useForm();
  const [addressForm] = Form.useForm();

  const [loading, setLoading] = useState(true);
  const [fileList, setFileList] = useState([]);

  const [addresses, setAddresses] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  // ===== Helper =====
  const getAvatarUrl = (avatar) => {
    if (!avatar) return null;
    if (avatar.startsWith("http")) return avatar;
    if (avatar.startsWith("/")) return `${API_URL}${avatar}`;
    return `${API_URL}/uploads/users/${avatar}`;
  };

  // ===== USER API =====
  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const res = await userService.getUserById(id);
      const user = res.data.data;

      form.setFieldsValue(user);

      if (user.avatar) {
        const avatarUrl = getAvatarUrl(user.avatar);
        setFileList([
          {
            uid: "-1",
            name: user.avatar,
            status: "done",
            url: avatarUrl,
          },
        ]);
      }
    } catch (err) {
      toast.error("Không tìm thấy người dùng");
    } finally {
      setLoading(false);
    }
  }, [id, form, toast]);

  const fetchAddresses = useCallback(async () => {
    try {
      const res = await AddressService.getAllAddresses();
      const list = res.data.data.filter((item) => item.user_id === Number(id));
      setAddresses(list);
    } catch {
      toast.error("Lỗi tải địa chỉ");
    }
  }, [id, toast]);

  useEffect(() => {
    fetchUser();
    fetchAddresses();
  }, [fetchUser, fetchAddresses]);

  // ===== ACTIONS =====
  const onFinish = async (values) => {
    try {
      const data = new FormData();
      Object.keys(values).forEach((key) => {
        if (values[key] !== undefined && values[key] !== null) {
          data.append(key, values[key]);
        }
      });

      if (fileList.length > 0 && fileList[0].originFileObj) {
        data.append("avatar", fileList[0].originFileObj);
      }

      await userService.updateUser(id, data);
      toast.success("Cập nhật người dùng thành công");
      navigate("/admin/users");
    } catch {
      toast.error("Cập nhật thất bại");
    }
  };

  const saveAddress = async (values) => {
    try {
      if (editingAddress) {
        await AddressService.updateAddress(editingAddress.id, values);
        toast.success("Cập nhật địa chỉ thành công");
      } else {
        await AddressService.createAddress({
          ...values,
          user_id: Number(id),
        });
        toast.success("Thêm địa chỉ thành công");
      }

      handleCancelModal();
      fetchAddresses();
    } catch {
      toast.error("Lỗi xử lý địa chỉ");
    }
  };

  const editAddress = (record) => {
    setEditingAddress(record);
    setOpen(true);
    // Sử dụng reset và set để đảm bảo form sạch và có data mới
    addressForm.setFieldsValue(record);
  };

  const deleteAddress = async (addrId) => {
    try {
      await AddressService.deleteAddress(addrId);
      toast.success("Xóa địa chỉ thành công");
      fetchAddresses();
    } catch {
      toast.error("Xóa địa chỉ thất bại");
    }
  };

  const handleCancelModal = () => {
    setOpen(false);
    addressForm.resetFields();
    setEditingAddress(null);
  };

  const columns = [
    { title: "Tên", dataIndex: "full_name" },
    { title: "Phone", dataIndex: "phone" },
    { title: "Tỉnh/TP", dataIndex: "province" },
    { title: "Quận/Huyện", dataIndex: "district" },
    { title: "Xã/Phường", dataIndex: "ward" },
    {
      title: "Mặc định",
      dataIndex: "is_default",
      render: (v) =>
        v === 1 ? <Tag color="green">Mặc định</Tag> : <Tag>Thường</Tag>,
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => editAddress(record)}
          />
          <Popconfirm
            title="Xóa địa chỉ này?"
            onConfirm={() => deleteAddress(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Chỉnh sửa thông tin thành viên"
      className="max-w-4xl mx-auto mt-10"
      extra={
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingAddress(null);
            addressForm.resetFields();
            setOpen(true);
          }}
        >
          Thêm địa chỉ
        </Button>
      }
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Skeleton loading={loading} active>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Họ và tên"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập tên" }]}
            >
              <Input placeholder="Nguyễn Văn A" />
            </Form.Item>

            <Form.Item label="Số điện thoại" name="phone">
              <Input placeholder="090..." />
            </Form.Item>
          </div>

          <Form.Item label="Ảnh đại diện">
            <Upload
              beforeUpload={() => false}
              listType="picture-card"
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              maxCount={1}
            >
              {fileList.length < 1 && (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Tải lên</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            size="large"
          >
            Lưu thay đổi User
          </Button>
        </Skeleton>
      </Form>

      <Divider titlePlacement="left">Danh sách địa chỉ</Divider>

      <Skeleton loading={loading} active>
        <Table
          columns={columns}
          dataSource={addresses}
          rowKey="id"
          pagination={false}
          size="small"
        />
      </Skeleton>

      <Modal
        title={editingAddress ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
        open={open}
        onCancel={handleCancelModal}
        footer={null}
        // THAY ĐỔI Ở ĐÂY: destroyOnClose -> destroyOnHidden
        destroyOnHidden
      >
        <Form form={addressForm} layout="vertical" onFinish={saveAddress}>
          <Form.Item
            name="full_name"
            label="Tên người nhận"
            rules={[{ required: true, message: "Vui lòng nhập tên người nhận" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="phone" label="Số điện thoại nhận hàng">
            <Input />
          </Form.Item>

          <div className="grid grid-cols-3 gap-2">
            <Form.Item name="province" label="Tỉnh">
              <Input />
            </Form.Item>
            <Form.Item name="district" label="Huyện">
              <Input />
            </Form.Item>
            <Form.Item name="ward" label="Xã">
              <Input />
            </Form.Item>
          </div>

          <Form.Item name="address_detail" label="Địa chỉ chi tiết">
            <Input.TextArea rows={2} />
          </Form.Item>

          <Button type="primary" htmlType="submit" block size="large">
            {editingAddress ? "Cập nhật ngay" : "Thêm mới địa chỉ"}
          </Button>
        </Form>
      </Modal>
    </Card>
  );
};

export default Edit;