import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Form,
  Input,
  Button,
  Upload,
  Card,
  Typography
} from "antd";

import {
  UploadOutlined,
  PlusOutlined
} from "@ant-design/icons";

import brandService from "../../../../services/brand.service";
import { useToast } from "../../../../context/ToastProvider";

const { Title } = Typography;

const Add = () => {

  const navigate = useNavigate();
  const toast = useToast();

  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  const onFinish = async (values) => {

    setLoading(true);

    try {

      const formData = new FormData();

      formData.append("name", values.name);

      if (fileList.length > 0) {
        formData.append("logo", fileList[0].originFileObj);
      }

      await brandService.createBrand(formData);

      toast.success("Thêm thương hiệu thành công");

      navigate("/admin/brands");

    } catch (error) {

      console.log(error.response?.data);

      toast.error(
        error.response?.data?.message || "Thêm thương hiệu thất bại"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="p-6">

      <Card className="max-w-xl mx-auto">

        <Title level={3}>
          <PlusOutlined /> Thêm Brand
        </Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >

          <Form.Item
            label="Tên thương hiệu"
            name="name"
            rules={[
              { required: true, message: "Nhập tên thương hiệu" }
            ]}
          >
            <Input placeholder="Ví dụ: Coca Cola" />
          </Form.Item>

          <Form.Item label="Logo">

            <Upload
              beforeUpload={() => false}
              maxCount={1}
              listType="picture"
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
            >
              <Button icon={<UploadOutlined />}>
                Chọn logo
              </Button>
            </Upload>

          </Form.Item>

          <Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
            >
              Tạo Brand
            </Button>

          </Form.Item>

        </Form>

      </Card>

    </div>

  );

};

export default Add;
