import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Input, Button, Upload, Card, Skeleton } from "antd";
import { UploadOutlined, SaveOutlined } from "@ant-design/icons";
import brandService from "../../../../services/brand.service";
import { useToast } from "../../../../context/ToastProvider";

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(true);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const res = await brandService.getBrandById(id);
        const brand = res.data.data;

        // Đổ dữ liệu vào form
        form.setFieldsValue({
          name: brand.name,
        });

        if (brand.logo) {
          setFileList([
            {
              uid: "-1",
              name: "logo.png",
              status: "done",
              url: `http://tbtshoplt.xyz${brand.logo}`,
            },
          ]);
        }
      } catch (error) {
        toast.error("Không tìm thấy brand");
        navigate("/admin/brands");
      } finally {
        setLoading(false);
      }
    };

    fetchBrand();
  }, [id, form, navigate, toast]);

  const onFinish = async (values) => {
    try {
      const data = new FormData();
      data.append("name", values.name);

      if (fileList.length > 0 && fileList[0].originFileObj) {
        data.append("logo", fileList[0].originFileObj);
      }

      await brandService.updateBrand(id, data);
      toast.success("Cập nhật thương hiệu thành công");
      navigate("/admin/brands");
    } catch {
      toast.error("Cập nhật thương hiệu thất bại");
    }
  };

  return (
    <div className="p-6">
      <Card title="Chỉnh sửa Brand" className="max-w-2xl mx-auto">
        {/* Luôn render Form để tránh lỗi "not connected" */}
        <Form form={form} layout="vertical" onFinish={onFinish}>
          {loading ? (
            <Skeleton active paragraph={{ rows: 4 }} />
          ) : (
            <>
              <Form.Item
                label="Tên thương hiệu"
                name="name"
                rules={[{ required: true, message: "Nhập tên thương hiệu" }]}
              >
                <Input placeholder="Nhập tên thương hiệu..." />
              </Form.Item>

              <Form.Item label="Logo">
                <Upload
                  beforeUpload={() => false}
                  maxCount={1}
                  listType="picture"
                  fileList={fileList}
                  onChange={({ fileList }) => setFileList(fileList)}
                >
                  <Button icon={<UploadOutlined />}>Chọn logo</Button>
                </Upload>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  block
                >
                  Lưu thay đổi
                </Button>
              </Form.Item>
            </>
          )}
        </Form>
      </Card>
    </div>
  );
};

export default Edit;