import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  Form,
  Input,
  Button,
  Upload,
  Card,
  Typography,
  Select
} from "antd";

import {
  UploadOutlined,
  FileAddOutlined
} from "@ant-design/icons";

import ContractService from "../../../services/contract.service";
import supplierService from "../../../services/supplier.service";

import { useToast } from "../../../context/ToastProvider";

const { Title } = Typography;
const { Option } = Select;

const Add = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  // Giải pháp: Đưa hàm fetch vào trong useEffect
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await supplierService.getSuppliers();
        setSuppliers(res?.data?.data?.items || []);
      } catch (error) {
        toast.error("Không tải được danh sách nhà cung cấp");
      }
    };

    fetchSuppliers();
  }, [toast]); // Thêm toast vào dependency nếu nó đến từ context (thường là stable)

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const data = {
        title: values.title,
        supplier_id: values.supplier_id
      };

      if (fileList.length > 0) {
        // Lưu ý: Tùy vào API của bạn, có thể cần dùng FormData nếu gửi file
        data.file = fileList[0].originFileObj;
      }

      await ContractService.createContract(data);
      toast.success("Tạo hợp đồng thành công");
      navigate("/admin/contracts");
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi tạo hợp đồng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto mt-10">
      <Title level={3}>
        <FileAddOutlined /> Thêm hợp đồng
      </Title>

      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Tiêu đề"
          name="title"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
        >
          <Input placeholder="Nhập tên hợp đồng" />
        </Form.Item>

        <Form.Item
          label="Nhà cung cấp (Supplier)"
          name="supplier_id"
          rules={[{ required: true, message: "Vui lòng chọn nhà cung cấp" }]}
        >
          <Select
            showSearch
            optionFilterProp="children"
            placeholder="Chọn nhà cung cấp"
          >
            {suppliers.map((s) => (
              <Option key={s.id} value={s.id}>
                {s.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="File hợp đồng">
          <Upload
            beforeUpload={() => false} // Ngăn upload tự động lên server ngay lập tức
            maxCount={1}
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
          >
            <Button icon={<UploadOutlined />}>Upload file (PDF, Docx...)</Button>
          </Upload>
        </Form.Item>

        <Form.Item className="mt-6">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            size="large"
          >
            Tạo hợp đồng
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Add;