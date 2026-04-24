import { useEffect, useState, useCallback } from "react";
import {
  Card,
  Table,
  Button,
  Popconfirm,
  Tag,
  Space
} from "antd";

import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined
} from "@ant-design/icons";

import { useNavigate } from "react-router-dom";

import attributeService from "../../../services/attribute.service";
import attributeValueService from "../../../services/attributeValue.service";
import { useToast } from "../../../context/ToastProvider";

const AttributeList = () => {
  const [attributes, setAttributes] = useState([]);
  const [values, setValues] = useState([]);

  const navigate = useNavigate();
  const toast = useToast();

  // 1. Fetch dữ liệu từ API
  const fetchData = useCallback(async () => {
    try {
      const resAttr = await attributeService.getAll();
      const resVal = await attributeValueService.getAll();

      const attrData = Array.isArray(resAttr.data)
        ? resAttr.data
        : resAttr.data?.data || [];

      const valData = Array.isArray(resVal.data)
        ? resVal.data
        : resVal.data?.data || [];

      setAttributes(attrData);
      setValues(valData);
    } catch (err) {
      console.error(err);
      toast.error("Lỗi tải dữ liệu");
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 2. Xử lý xóa
  const handleDelete = async (id) => {
    try {
      await attributeService.remove(id);
      toast.success("Xóa thành công");
      fetchData(); 
    } catch (err) {
      toast.error("Xóa thất bại");
    }
  };

  // 3. Cấu hình cột cho bảng chính (Attributes)
  const columns = [
    {
      title: "STT",
      key: "stt",
      width: 70,
      align: "center",
      render: (_, __, index) => index + 1, // Hiển thị số thứ tự
    },
    { 
      title: "Tên thuộc tính", 
      dataIndex: "name", 
      key: "name" 
    },
    {
      title: "Số lượng giá trị",
      key: "values_count",
      render: (_, record) => {
        const count = values.filter(
          v => v.attribute_id === record.id
        ).length;
        return <Tag color="blue">{count} giá trị</Tag>;
      },
    },
    {
      title: "Hành động",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined
            onClick={() => navigate(`/admin/attributes/edit/${record.id}`)}
            style={{ color: "#1890ff", cursor: "pointer", fontSize: "18px" }}
          />
          <Popconfirm
            title="Xác nhận xóa thuộc tính này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <DeleteOutlined style={{ color: "#ff4d4f", cursor: "pointer", fontSize: "18px" }} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 4. Cấu hình bảng con khi mở rộng (Attribute Values)
  const expandedRowRender = (attr) => {
    const data = values.filter(
      v => v.attribute_id === attr.id
    );

    const childColumns = [
      { 
        title: "STT", 
        key: "stt_child", 
        width: 60, 
        render: (_, __, index) => index + 1 
      },
      { 
        title: "Giá trị", 
        dataIndex: "value", 
        key: "value" 
      }
    ];

    return (
      <Table
        rowKey="id"
        columns={childColumns}
        dataSource={data}
        pagination={false}
        size="small"
        bordered
      />
    );
  };

  return (
    <Card
      title="Danh sách thuộc tính sản phẩm"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/admin/attributes/add")}
        >
          Thêm thuộc tính
        </Button>
      }
    >
      <Table
        rowKey="id"
        columns={columns}
        dataSource={attributes}
        expandable={{ 
          expandedRowRender,
          columnTitle: "Chi tiết" // Tiêu đề cho cột icon dấu cộng
        }}
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
};

export default AttributeList;