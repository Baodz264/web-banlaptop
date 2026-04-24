import { Card, Row, Col, Typography, Space, Avatar, Tag } from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  EnvironmentOutlined
} from "@ant-design/icons";

import userService from "../../../services/user.service";
import { useEffect, useState } from "react";

const { Text } = Typography;

const ShippingAddress = ({ shipping_address, user_id }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!user_id) return;

    const fetchUser = async () => {
      try {
        const res = await userService.getUserById(user_id);
        setUser(res?.data?.data || null);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();
  }, [user_id]);

  if (!shipping_address) {
    return (
      <Card title="Địa chỉ giao hàng" style={{ marginBottom: 20 }}>
        <Text type="secondary">Không có dữ liệu địa chỉ</Text>
      </Card>
    );
  }

  return (
    <Card
      title="📍 Địa chỉ giao hàng (Snapshot)"
      style={{ marginBottom: 20, borderRadius: 12 }}
    >
      <Row gutter={[16, 16]}>
        {/* User */}
        <Col span={24}>
          <Space>
            <Avatar size={48} icon={<UserOutlined />} />
            <div>
              <Text strong>
                {shipping_address.full_name || user?.name || "Không có"}
              </Text>
              <br />
              <Text type="secondary">Người nhận</Text>
            </div>
          </Space>
        </Col>

        {/* Phone */}
        <Col xs={24} md={12}>
          <Space>
            <PhoneOutlined />
            <div>
              <Text strong>
                {shipping_address.phone || user?.phone || "Không có"}
              </Text>
              <br />
              <Text type="secondary">Số điện thoại</Text>
            </div>
          </Space>
        </Col>

        {/* Email */}
        <Col xs={24} md={12}>
          <Space>
            <MailOutlined />
            <div>
              <Text strong>{user?.email || "Không có"}</Text>
              <br />
              <Text type="secondary">Email</Text>
            </div>
          </Space>
        </Col>

        {/* Address */}
        <Col span={24}>
          <Space align="start">
            <HomeOutlined style={{ marginTop: 4 }} />
            <div>
              <Text strong>
                {shipping_address.address ||
                  `${shipping_address.address_detail || ""}, ${
                    shipping_address.ward || ""
                  }, ${shipping_address.district || ""}, ${
                    shipping_address.province || ""
                  }`}
              </Text>
              <br />
              <Text type="secondary">Địa chỉ giao hàng</Text>
            </div>
          </Space>
        </Col>

        {/* 📍 TOẠ ĐỘ */}
        <Col span={24}>
          <Space>
            <EnvironmentOutlined />
            <Tag color="blue">Lat: {shipping_address.lat}</Tag>
            <Tag color="green">Lng: {shipping_address.lng}</Tag>
          </Space>
        </Col>

        {/* 🔥 GOOGLE MAP */}
        <Col span={24}>
          <iframe
            title="Bản đồ vị trí giao hàng"
            width="100%"
            height="250"
            style={{ borderRadius: 12, border: 0 }}
            loading="lazy"
            allowFullScreen
            src={`https://maps.google.com/maps?q=${shipping_address.lat},${shipping_address.lng}&z=15&output=embed`}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default ShippingAddress;