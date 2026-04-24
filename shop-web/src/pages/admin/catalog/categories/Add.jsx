import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Upload,
  Card,
  Select,
  Typography,
  Flex,
} from "antd";
import {
  UploadOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import categoryService from "../../../../services/category.service";
import { useToast } from "../../../../context/ToastProvider";

const { Title, Text } = Typography;

const Add = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [parents, setParents] = useState([]);

  // Lấy danh sách danh mục cha khi component mount
  useEffect(() => {
    const fetchParent = async () => {
      try {
        setLoading(true);
        const res = await categoryService.getCategories();
        // Giả sử cấu trúc trả về là res.data.data.items
        setParents(res.data.data.items || []);
      } catch (error) {
        toast.error("Không thể tải danh sách danh mục cha");
      } finally {
        setLoading(false);
      }
    };

    fetchParent();
  }, [toast]);

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      const formData = new FormData();

      // Thêm các trường văn bản vào FormData
      Object.keys(values).forEach((key) => {
        if (values[key] !== undefined && values[key] !== null) {
          formData.append(key, values[key]);
        }
      });

      // Thêm file ảnh nếu có
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("image", fileList[0].originFileObj);
      }

      await categoryService.createCategory(formData);
      toast.success("Thêm danh mục mới thành công!");
      navigate("/admin/categories");
    } catch (error) {
      toast.error("Tạo danh mục thất bại. Vui lòng thử lại!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto mt-10 shadow-lg border-0">
      <Flex vertical gap="large">
        {/* Tiêu đề và nút quay lại */}
        <Flex align="center" gap="small">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/admin/categories")}
            type="text"
            shape="circle"
          />
          <Title level={3} style={{ margin: 0 }}>
            Thêm danh mục mới
          </Title>
        </Flex>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Tên danh mục"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục!" }]}
          >
            <Input
              placeholder="Nhập tên danh mục (Ví dụ: Điện tử, Thời trang...)"
              size="large"
            />
          </Form.Item>

          <Form.Item label="Danh mục cha (không bắt buộc)" name="parent_id">
            <Select
              allowClear
              placeholder="Chọn danh mục cấp trên"
              size="large"
              loading={loading}
            >
              {parents.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Hình ảnh minh họa">
            <Upload
              beforeUpload={() => false}
              maxCount={1}
              listType="picture"
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
            >
              <Button icon={<UploadOutlined />} size="large" block>
                Chọn ảnh tải lên
              </Button>
            </Upload>
            <div className="mt-2 text-center">
              <Text type="secondary" italic className="text-xs">
                * Chỉ chấp nhận 1 file ảnh duy nhất.
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
              icon={<PlusOutlined />}
              size="large"
            >
              Tạo danh mục
            </Button>
          </Flex>
        </Form>
      </Flex>
    </Card>
  );
};

export default Add;