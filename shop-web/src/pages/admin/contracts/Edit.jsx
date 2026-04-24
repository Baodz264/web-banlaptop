import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  Form,
  Input,
  Button,
  Upload,
  Card,
  Select
} from "antd";

import { UploadOutlined } from "@ant-design/icons";

import ContractService from "../../../services/contract.service";
import supplierService from "../../../services/supplier.service";

import { useToast } from "../../../context/ToastProvider";

const { Option } = Select;

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const toast = useToast();

  const [suppliers, setSuppliers] = useState([]);
  const [fileList, setFileList] = useState([]);

  // Hàm fetchSuppliers dùng useCallback để tránh tạo lại hàm mỗi lần render
  const fetchSuppliers = useCallback(async () => {
    try {
      const res = await supplierService.getSuppliers();
      setSuppliers(res?.data?.data?.items || []);
    } catch {
      toast.error("Không tải được supplier");
    }
  }, [toast]);

  // Hàm fetchContract dùng useCallback vì nó phụ thuộc vào id
  const fetchContract = useCallback(async () => {
    try {
      const res = await ContractService.getContractById(id);
      form.setFieldsValue(res.data.data);
    } catch {
      toast.error("Không tải được dữ liệu hợp đồng");
    }
  }, [id, form, toast]);

  useEffect(() => {
    fetchContract();
    fetchSuppliers();
  }, [fetchContract, fetchSuppliers]);

  const onFinish = async (values) => {
    try {
      const data = { ...values };

      if (fileList.length > 0) {
        data.file = fileList[0].originFileObj;
      }

      await ContractService.updateContract(id, data);
      toast.success("Cập nhật thành công");
      navigate("/admin/contracts");
    } catch {
      toast.error("Cập nhật thất bại");
    }
  };

  return (
    <Card title="Cập nhật hợp đồng">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item label="Tiêu đề" name="title">
          <Input />
        </Form.Item>

        <Form.Item label="Supplier" name="supplier_id">
          <Select placeholder="Chọn supplier">
            {suppliers.map(s => (
              <Option key={s.id} value={s.id}>
                {s.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Status" name="status">
          <Select>
            <Option value="active">Active</Option>
            <Option value="expired">Expired</Option>
            <Option value="cancelled">Cancelled</Option>
          </Select>
        </Form.Item>

        <Form.Item label="File mới">
          <Upload
            beforeUpload={() => false}
            maxCount={1}
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
          >
            <Button icon={<UploadOutlined />}>
              Upload
            </Button>
          </Upload>
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Cập nhật
        </Button>
      </Form>
    </Card>
  );
};

export default Edit;