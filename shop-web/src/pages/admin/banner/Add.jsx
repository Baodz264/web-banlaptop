import { useNavigate } from "react-router-dom";
import {
  Card,
  Form,
  Input,
  Button,
  Upload,
  Select,
  Space
} from "antd";

import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";

import bannerService from "../../../services/banner.service";
import { useToast } from "../../../context/ToastProvider";

const Add = () => {

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const toast = useToast();

  const normFile = (e) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };

  const onFinish = async (values) => {

    try {

      const formData = new FormData();

      let link = values.link || "";

      if (link && !link.startsWith("http")) {
        link = "https://" + link;
      }

      formData.append("title", values.title);
      formData.append("link", link);
      formData.append("position", values.position || "");
      formData.append("status", values.status ?? 1);

      if (values.image && values.image.length > 0) {
        formData.append("image", values.image[0].originFileObj);
      }

      await bannerService.create(formData);

      toast.success("Tạo banner thành công 🎉");

      form.resetFields();

      navigate("/admin/banners");

    } catch (error) {

      console.error(error);

      toast.error(
        error.response?.data?.message || "Tạo banner thất bại"
      );
    }
  };

  return (
    <Card
      title="Thêm Banner"
      extra={
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/admin/banners")}
        >
          Quay lại
        </Button>
      }
    >

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >

        <Form.Item
          label="Tiêu đề"
          name="title"
          rules={[
            { required: true, message: "Vui lòng nhập tiêu đề banner" }
          ]}
        >
          <Input placeholder="Banner title" />
        </Form.Item>

        <Form.Item label="Link" name="link">
          <Input placeholder="https://example.com" />
        </Form.Item>

        <Form.Item label="Vị trí" name="position">
          <Input placeholder="home / sidebar / top" />
        </Form.Item>

        <Form.Item
          label="Trạng thái"
          name="status"
          initialValue={1}
        >
          <Select
            options={[
              { value: 1, label: "Hoạt động" },
              { value: 0, label: "Tắt" }
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Hình ảnh"
          name="image"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[
            { required: true, message: "Vui lòng chọn ảnh banner" }
          ]}
        >
          <Upload
            beforeUpload={() => false}
            maxCount={1}
            listType="picture-card"
          >
            <Button icon={<UploadOutlined />}>
              Upload
            </Button>
          </Upload>
        </Form.Item>

        <Space>
          <Button
            type="primary"
            htmlType="submit"
          >
            Tạo Banner
          </Button>

          <Button onClick={() => form.resetFields()}>
            Làm mới
          </Button>
        </Space>

      </Form>
    </Card>
  );
};

export default Add;
