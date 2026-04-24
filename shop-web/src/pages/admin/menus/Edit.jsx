import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Form,
  Input,
  Button,
  Card,
  Select,
  InputNumber,
  Skeleton
} from "antd";

import menuService from "../../../services/menu.service";
import { useToast } from "../../../context/ToastProvider";

const Edit = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [parents, setParents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ===== GET DETAIL =====
        const res = await menuService.getMenuById(id);
        const menuData = res.data?.data;

        // Chỉ set field cần thiết
        form.setFieldsValue({
          name: menuData.name,
          link: menuData.link,
          parent_id: menuData.parent_id,
          position: menuData.position,
          status: menuData.status
        });

        // ===== GET LIST =====
        const list = await menuService.getMenus();
        const data = list.data?.data || {};
        const items = data.items || [];

        // Không cho chọn chính nó
        const filtered = items.filter((item) => item.id !== Number(id));
        setParents(filtered);

      } catch (error) {
        console.error(error);
        toast.error("Không tìm thấy menu");
        navigate("/admin/menus");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Thêm các dependencies vào đây để fix lỗi ESLint
  }, [id, form, navigate, toast]);

  // ===== SUBMIT =====
  const onFinish = async (values) => {
    try {
      // FORMAT DATA TRƯỚC KHI GỬI
      const payload = {
        name: values.name,
        link: values.link || "",
        parent_id: values.parent_id ?? null, // QUAN TRỌNG
        position: values.position ?? 0,
        status: values.status ?? 1
      };

      console.log("DATA SEND:", payload); // debug

      await menuService.updateMenu(id, payload);

      toast.success("Cập nhật menu thành công");
      navigate("/admin/menus");
    } catch (error) {
      console.error("API ERROR:", error.response?.data);
      toast.error(error.response?.data?.message || "Cập nhật menu thất bại");
    }
  };

  return (
    <Card className="max-w-2xl mx-auto mt-10">
      <h2 className="text-xl font-bold mb-5">Chỉnh sửa Menu</h2>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Skeleton loading={loading} active>

          <Form.Item
            name="name"
            label="Tên Menu"
            rules={[{ required: true, message: "Vui lòng nhập tên menu" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="link" label="Link">
            <Input />
          </Form.Item>

          <Form.Item name="parent_id" label="Parent Menu">
            <Select allowClear placeholder="Chọn menu cha">
              {parents.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="position" label="Position">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="status" label="Trạng thái" initialValue={1}>
            <Select>
              <Select.Option value={1}>Hiển thị</Select.Option>
              <Select.Option value={0}>Ẩn</Select.Option>
            </Select>
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={loading}>
            Lưu Menu
          </Button>

        </Skeleton>
      </Form>
    </Card>
  );
};

export default Edit;