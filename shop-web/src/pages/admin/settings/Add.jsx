import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Form,
  Input,
  Button,
  Card,
  Typography
} from "antd";

import { PlusOutlined } from "@ant-design/icons";

import settingService from "../../../services/setting.service";
import { useToast } from "../../../context/ToastProvider";

const { Title } = Typography;

const Add = () => {

  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {

    setLoading(true);

    try {

      await settingService.createSetting(values);

      toast.success("Thêm setting thành công");

      navigate("/admin/settings");

    } catch (error) {

      console.log(error);

      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi tạo setting"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="p-6">

      <Card className="max-w-2xl mx-auto shadow-md">

        <Title level={3}>Thêm Setting</Title>

        <Form layout="vertical" onFinish={onFinish}>

          <Form.Item
            label="Key"
            name="key"
            rules={[
              { required: true, message: "Nhập key!" }
            ]}
          >
            <Input placeholder="site_name" />
          </Form.Item>

          <Form.Item
            label="Value"
            name="value"
          >
            <Input.TextArea
              rows={4}
              placeholder="Giá trị setting"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            icon={<PlusOutlined />}
            loading={loading}
            block
          >
            Tạo Setting
          </Button>

        </Form>

      </Card>

    </div>

  );

};

export default Add;
