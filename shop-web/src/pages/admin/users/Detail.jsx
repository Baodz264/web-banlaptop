import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  Card,
  Avatar,
  Typography,
  Row,
  Col,
  Tag,
  Button,
  Divider,
  Table,
  message
} from "antd";

import {
  ArrowLeftOutlined,
  UserOutlined
} from "@ant-design/icons";

import userService from "../../../services/user.service";
import AddressService from "../../../services/address.service";

const { Title, Text } = Typography;

const API_URL = "tbtshoplt.xyz";

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const res = await userService.getUserById(id);
      setUser(res?.data?.data);
    } catch (error) {
      console.error(error);
      message.error("Không tải được thông tin user");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchAddresses = useCallback(async () => {
    try {
      const res = await AddressService.getAllAddresses();

      const list = res.data.data.filter(
        (item) => item.user_id === Number(id)
      );

      setAddresses(list);
    } catch (error) {
      console.error(error);
      message.error("Không tải được địa chỉ");
    }
  }, [id]);

  useEffect(() => {
    fetchUser();
    fetchAddresses();
  }, [fetchUser, fetchAddresses]);

  const getAvatarUrl = (avatar) => {
    if (!avatar) return null;
    if (avatar.startsWith("http")) return avatar;
    if (avatar.startsWith("/")) return `${API_URL}${avatar}`;
    return `${API_URL}/uploads/users/${avatar}`;
  };

  // ✅ Role mapping chuẩn
  const roleMap = {
    admin: { color: "red", label: "Quản trị" },
    staff: { color: "purple", label: "Nhân viên" },
    shipper: { color: "blue", label: "Shipper" },
    user: { color: "green", label: "Khách hàng" },
  };

  // ================= ADDRESS TABLE =================
  const columns = [
    {
      title: "Tên",
      dataIndex: "full_name",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Tỉnh",
      dataIndex: "province",
    },
    {
      title: "Huyện",
      dataIndex: "district",
    },
    {
      title: "Xã",
      dataIndex: "ward",
    },
    {
      title: "Chi tiết",
      dataIndex: "address_detail",
    },
    {
      title: "Mặc định",
      dataIndex: "is_default",
      render: (v) =>
        v === 1 ? <Tag color="green">Default</Tag> : <Tag>Normal</Tag>,
    },
  ];

  if (loading) return <Card loading style={{ margin: 20 }} />;

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "auto" }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 20 }}
      >
        Quay lại
      </Button>

      {/* USER INFO */}
      <Card title="Chi tiết người dùng">
        <Row gutter={[16, 16]}>
          <Col span={24} style={{ textAlign: "center" }}>
            <Avatar
              size={120}
              src={getAvatarUrl(user?.avatar)}
              icon={<UserOutlined />}
            />
            <Title level={4} style={{ marginTop: 10 }}>
              {user?.name}
            </Title>
          </Col>

          <Divider />

          <Col span={12}>
            <Text strong>ID:</Text>
            <div>{user?.id}</div>
          </Col>

          <Col span={12}>
            <Text strong>Email:</Text>
            <div>{user?.email}</div>
          </Col>

          <Col span={12}>
            <Text strong>SĐT:</Text>
            <div>{user?.phone || "Không có"}</div>
          </Col>

          <Col span={12}>
            <Text strong>Vai trò:</Text>
            <div>
              {(() => {
                const roleInfo = roleMap[user?.role] || roleMap.user;
                return <Tag color={roleInfo.color}>{roleInfo.label}</Tag>;
              })()}
            </div>
          </Col>

          <Col span={12}>
            <Text strong>Trạng thái:</Text>
            <div>
              {user?.status === 1 ? (
                <Tag color="green">Hoạt động</Tag>
              ) : (
                <Tag color="red">Bị khóa</Tag>
              )}
            </div>
          </Col>

          <Col span={12}>
            <Text strong>Ngày tạo:</Text>
            <div>
              {user?.created_at
                ? new Date(user.created_at).toLocaleString()
                : "N/A"}
            </div>
          </Col>
        </Row>
      </Card>

      {/* ADDRESS */}
      <Card title="Danh sách địa chỉ" style={{ marginTop: 24 }}>
        <Table
          columns={columns}
          dataSource={addresses}
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default Detail;
