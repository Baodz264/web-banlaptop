import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Upload,
  Card,
  Skeleton,
  Select,
  Space
} from "antd";
import {
  UploadOutlined,
  SaveOutlined,
  ArrowLeftOutlined
} from "@ant-design/icons";

import productService from "../../../services/product.service";
import categoryService from "../../../services/category.service";
import BrandService from "../../../services/brand.service";
import { useToast } from "../../../context/ToastProvider";

const { Option } = Select;

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  
  // Khởi tạo form
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const initData = async () => {
      try {
        const [productRes, cateRes, brandRes] = await Promise.all([
          productService.getProductById(id),
          categoryService.getCategories(),
          BrandService.getBrands()
        ]);

        const product = productRes.data.data;
        
        // Cập nhật dữ liệu vào form instance
        form.setFieldsValue(product);

        if (product.thumbnail) {
          setFileList([
            {
              uid: "-1",
              name: "thumbnail.png",
              status: "done",
              url: `http://tbtshoplt.xyz${product.thumbnail}`
            }
          ]);
        }

        setCategories(cateRes.data.data.items || []);
        setBrands(brandRes.data.data.items || []);
      } catch (error) {
        toast.error("Không tìm thấy dữ liệu sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [id, form, toast]);

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      const data = new FormData();
      Object.keys(values).forEach((key) => {
        if (values[key] !== undefined) data.append(key, values[key]);
      });

      if (fileList.length > 0 && fileList[0].originFileObj) {
        data.append("thumbnail", fileList[0].originFileObj);
      }

      await productService.updateProduct(id, data);
      toast.success("Cập nhật thành công");
      navigate("/admin/products");
    } catch (error) {
      toast.error("Cập nhật thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card 
      title={<Space><ArrowLeftOutlined onClick={() => navigate(-1)} /> Chỉnh sửa sản phẩm</Space>}
      className="max-w-3xl mx-auto mt-10"
    >
      {/* QUAN TRỌNG: Thẻ <Form> luôn được render ở đây, 
          không nằm trong bất kỳ câu lệnh điều kiện (if/ternary) nào.
      */}
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Skeleton loading={loading} active paragraph={{ rows: 12 }}>
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[{ required: true, message: "Nhập tên sản phẩm" }]}
          >
            <Input />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Category"
              name="category_id"
              rules={[{ required: true, message: "Chọn category" }]}
            >
              <Select>
                {categories.map((item) => (
                  <Option key={item.id} value={item.id}>{item.name}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Brand"
              name="brand_id"
              rules={[{ required: true, message: "Chọn brand" }]}
            >
              <Select>
                {brands.map((item) => (
                  <Option key={item.id} value={item.id}>{item.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <Form.Item label="Loại sản phẩm" name="product_type">
            <Select>
              <Option value="main">Main</Option>
              <Option value="accessory">Accessory</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item label="Thumbnail">
            <Upload
              beforeUpload={() => false}
              listType="picture-card"
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
            >
              {fileList.length < 1 && <UploadOutlined />}
            </Upload>
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            block
            loading={submitting}
          >
            Lưu sản phẩm
          </Button>
        </Skeleton>
      </Form>
    </Card>
  );
};

export default Edit;