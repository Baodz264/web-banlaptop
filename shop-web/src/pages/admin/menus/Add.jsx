import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  Form,
  Input,
  Button,
  Card,
  Select,
  InputNumber
} from "antd";

import { PlusOutlined } from "@ant-design/icons";

import menuService from "../../../services/menu.service";
import { useToast } from "../../../context/ToastProvider";

const Add = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [parents, setParents] = useState([]);

  useEffect(() => {
    const fetchParents = async () => {
      try {
        const res = await menuService.getMenus();
        const data = res.data?.data || {};
        const items = data.items || [];
        setParents(items);
      } catch (error) {
        console.error(error);
        toast.error("Không tải được menu cha");
      }
    };

    fetchParents();
    // Thêm 'toast' vào mảng dependency để sửa lỗi ESLint.
    // Vì toast thường được memoize trong Context, nó sẽ không gây loop vô tận.
  }, [toast]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await menuService.createMenu(values);
      toast.success("Tạo menu thành công");
      navigate("/admin/menus");
    } catch (error) {
      console.error(error);
      toast.error("Tạo menu thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto mt-10">
      <h2 className="text-xl font-bold mb-5">Thêm Menu</h2>

      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Tên Menu"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên menu" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Link"
          name="link"
        >
          <Input placeholder="/products" />
        </Form.Item>

        <Form.Item
          label="Parent Menu"
          name="parent_id"
        >
          <Select
            allowClear
            placeholder="Chọn menu cha"
          >
            {parents.map((item) => (
              <Select.Option
                key={item.id}
                value={item.id}
              >
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Position"
          name="position"
        >
          <InputNumber
            min={0}
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          icon={<PlusOutlined />}
          loading={loading}
          block
        >
          Tạo Menu
        </Button>
      </Form>
    </Card>
  );
};

export default Add;