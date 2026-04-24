import React, { useState, useEffect } from "react";
import { Card, Button, Typography, Modal, Tag, Space, Flex } from "antd";
import AddressService from "../../../services/address.service";
import AddressForm from "./AddressForm";
import { useToast } from "../../../context/ToastProvider";

const { Text } = Typography;

const CheckoutUserInfo = ({ user, onAddressChange }) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [editingAddress, setEditingAddress] = useState(null);

  const toast = useToast();

  useEffect(() => {
    fetchAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await AddressService.getAddresses();
      const list = res?.data?.data || [];
      setAddresses(list);

      const defaultAddr = list.find((a) => a.is_default === 1) || list[0];
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
        onAddressChange && onAddressChange(defaultAddr);
      }
    } catch (error) {
      toast.error("Không tải được danh sách địa chỉ");
    }
  };

  const handleSelectAddress = (addr) => {
    setSelectedAddressId(addr.id);
    onAddressChange && onAddressChange(addr);
  };

  const handleDeleteAddress = async (id) => {
    try {
      await AddressService.deleteAddress(id);
      toast.success("Xóa địa chỉ thành công");
      fetchAddresses();
      if (selectedAddressId === id) {
        onAddressChange && onAddressChange(null);
        setSelectedAddressId(null);
      }
    } catch (error) {
      toast.error("Xóa địa chỉ thất bại");
    }
  };

  const handleSaveAddress = async (data) => {
    try {
      let savedAddr;
      if (editingAddress?.id) {
        const res = await AddressService.updateAddress(editingAddress.id, data);
        savedAddr = res?.data?.data;
      } else {
        const res = await AddressService.createAddress(data);
        savedAddr = res?.data?.data;
      }
      toast.success("Lưu địa chỉ thành công");
      setEditingAddress(null);
      fetchAddresses();

      if (data.is_default === 1 || !selectedAddressId) {
        setSelectedAddressId(savedAddr?.id);
        onAddressChange && onAddressChange(savedAddr);
      }
    } catch (error) {
      toast.error("Lưu địa chỉ thất bại");
    }
  };

  return (
    <Card
      title="Thông tin người nhận"
      style={{
        marginBottom: 16,
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      }}
    >
      {/* Sửa direction="vertical" của Space thành Component Flex để linh hoạt và tránh warning orientation */}
      <Flex vertical gap="middle" style={{ width: "100%" }}>
        
        {/* THÔNG TIN USER GỐC */}
        <Card
          type="inner"
          style={{ borderRadius: 8, background: "#fafafa" }}
        >
          <Flex vertical gap={4}>
            <Text strong>
              {user?.name} - <Text type="secondary">{user?.phone}</Text>
            </Text>
            <Text type="secondary">{user?.email}</Text>
          </Flex>
        </Card>

        {/* DANH SÁCH ĐỊA CHỈ */}
        <div className="address-list">
          {addresses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
              Chưa có địa chỉ nào
            </div>
          ) : (
            addresses.map((addr) => (
              <Card
                key={addr.id}
                type="inner"
                size="small"
                style={{
                  marginBottom: 10,
                  borderRadius: 8,
                  borderColor: addr.id === selectedAddressId ? "#1890ff" : "#f0f0f0",
                  backgroundColor: addr.id === selectedAddressId ? "#e6f7ff" : "#fff",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
                  transition: "all 0.3s"
                }}
              >
                <Flex justify="space-between" align="center">
                  <div style={{ flex: 1, marginRight: 16 }}>
                    <div style={{ fontWeight: 500, marginBottom: 4 }}>
                      {addr.full_name} - {addr.phone}{" "}
                      {addr.is_default === 1 && (
                        <Tag color="green" style={{ marginLeft: 8 }}>
                          Mặc định
                        </Tag>
                      )}
                    </div>
                    <div style={{ color: "#555", fontSize: "13px" }}>
                      {addr.address_detail}, {addr.ward}, {addr.district}, {addr.province}
                    </div>
                  </div>
                  
                  {/* Space ngang (mặc định) vẫn dùng tốt, không cần orientation */}
                  <Space size="small">
                    <Button
                      size="small"
                      type={addr.id === selectedAddressId ? "primary" : "default"}
                      onClick={() => handleSelectAddress(addr)}
                    >
                      {addr.id === selectedAddressId ? "Đang chọn" : "Chọn"}
                    </Button>
                    <Button
                      size="small"
                      type="link"
                      onClick={() => setEditingAddress(addr)}
                    >
                      Sửa
                    </Button>
                    <Button
                      size="small"
                      type="link"
                      danger
                      onClick={() => handleDeleteAddress(addr.id)}
                    >
                      Xóa
                    </Button>
                  </Space>
                </Flex>
              </Card>
            ))
          )}
        </div>

        {/* NÚT THÊM MỚI */}
        <Button
          type="dashed"
          block
          style={{ borderRadius: 8, height: "40px" }}
          onClick={() => setEditingAddress({})}
        >
          + Thêm địa chỉ mới
        </Button>

        {/* MODAL THÊM/SỬA */}
        <Modal
          title={editingAddress?.id ? "Sửa địa chỉ" : "Thêm địa chỉ mới"}
          open={!!editingAddress}
          onCancel={() => setEditingAddress(null)}
          footer={null}
          centered
          // FIX: Thay thế destroyOnClose bằng destroyOnHidden theo cảnh báo mới nhất của Antd
          destroyOnHidden
        >
          {editingAddress && (
            <AddressForm
              address={editingAddress}
              onSave={handleSaveAddress}
              onCancel={() => setEditingAddress(null)}
            />
          )}
        </Modal>
      </Flex>
    </Card>
  );
};

export default CheckoutUserInfo;