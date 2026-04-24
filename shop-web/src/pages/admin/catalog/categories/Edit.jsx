import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Upload,
  Card,
  Select,
  Skeleton,
  Typography,
  Flex,
} from "antd";
import {
  UploadOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import categoryService from "../../../../services/category.service";
import { useToast } from "../../../../context/ToastProvider";

const { Title, Text } = Typography;

const Edit = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [parents, setParents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoryRes, listRes] = await Promise.all([
          categoryService.getCategoryById(id),
          categoryService.getCategories(),
        ]);

        const categoryData = categoryRes.data.data;
        
        // Đổ dữ liệu vào Form
        form.setFieldsValue({
          name: categoryData.name,
          parent_id: categoryData.parent_id,
        });

        // Lọc danh sách cha (loại bỏ chính nó để không bị lỗi logic cha-con vòng lặp)
        const categoriesList = listRes.data.data.items.filter(
          (item) => item.id !== id
        );
        setParents(categoriesList);
      } catch (error) {
        toast.error("Không tìm thấy danh mục hoặc lỗi tải dữ liệu!");
        navigate("/admin/categories");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, form, navigate, toast]);

  const onFinish = async (values) => {
    try {
      setSubmitting(true);
      const data = new FormData();

      // Thêm các trường văn bản
      data.append("name", values.name);
      if (values.parent_id) {
        data.append("parent_id", values.parent_id);
      }

      // Kiểm tra nếu có chọn ảnh mới
      if (fileList.length > 0 && fileList[0].originFileObj) {
        data.append("image", fileList[0].originFileObj);
      }

      await categoryService.updateCategory(id, data);
      toast.success("Cập nhật danh mục thành công!");
      navigate("/admin/categories");
    } catch (error) {
      toast.error("Cập nhật danh mục thất bại. Vui lòng kiểm tra lại!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto mt-10 shadow-lg border-0">
      {/* Thay thế Space bằng Flex để sửa lỗi Warning direction */}
      <Flex vertical gap="large">
        <Flex align="center" gap="small">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/admin/categories")}
            type="text"
            shape="circle"
          />
          <Title level={3} style={{ margin: 0 }}>
            Chỉnh sửa danh mục
          </Title>
        </Flex>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Skeleton loading={loading} active paragraph={{ rows: 8 }}>
            <Form.Item
              name="name"
              label="Tên danh mục"
              rules={[{ required: true, message: "Vui lòng nhập tên danh mục!" }]}
            >
              <Input
                placeholder="Nhập tên danh mục (Ví dụ: Đồ gia dụng)"
                size="large"
              />
            </Form.Item>

            <Form.Item name="parent_id" label="Danh mục cha">
              <Select
                allowClear
                placeholder="Chọn danh mục cấp trên (nếu có)"
                size="large"
              >
                {parents.map((item) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Hình ảnh danh mục">
              <Upload
                beforeUpload={() => false}
                listType="picture"
                fileList={fileList}
                onChange={({ fileList }) => setFileList(fileList)}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />} size="large" block>
                  Thay đổi ảnh đại diện
                </Button>
              </Upload>
              <div className="mt-2 text-center">
                <Text type="secondary" italic className="text-xs">
                  * Để trống nếu bạn muốn giữ lại ảnh cũ.
                </Text>
              </div>
            </Form.Item>

            <Flex gap="middle" className="mt-6">
              <Button
                onClick={() => navigate("/admin/categories")}
                className="flex-1"
                size="large"
              >
                Hủy bỏ
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                className="flex-1"
                icon={<SaveOutlined />}
                size="large"
              >
                Lưu thay đổi
              </Button>
            </Flex>
          </Skeleton>
        </Form>
      </Flex>
    </Card>
  );
};

export default Edit;