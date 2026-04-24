import { useState, useEffect } from "react";
import { Form, Input, Button, Upload, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import productService from "../../../../services/product.service";
import categoryService from "../../../../services/category.service";
import BrandService from "../../../../services/brand.service";
import { useToast } from "../../../../context/ToastProvider";

const { Option } = Select;

const ProductForm = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const cate = await categoryService.getCategories();
    const brand = await BrandService.getBrands();

    setCategories(cate.data.data.items);
    setBrands(brand.data.data.items);
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const data = new FormData();

      Object.keys(values).forEach((key) => {
        data.append(key, values[key]);
      });

      if (fileList.length > 0) {
        data.append("thumbnail", fileList[0].originFileObj);
      }

      await productService.createProduct(data);

      toast.success("Tạo sản phẩm thành công");
      navigate("/admin/products");
    } catch {
      toast.error("Tạo sản phẩm thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" onFinish={onFinish}>
      <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item name="category_id" label="Category" rules={[{ required: true }]}>
        <Select>
          {categories.map((c) => (
            <Option key={c.id} value={c.id}>{c.name}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="brand_id" label="Brand" rules={[{ required: true }]}>
        <Select>
          {brands.map((b) => (
            <Option key={b.id} value={b.id}>{b.name}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="product_type" initialValue="main">
        <Select>
          <Option value="main">Main</Option>
          <Option value="accessory">Accessory</Option>
        </Select>
      </Form.Item>

      <Form.Item name="description" label="Mô tả">
        <Input.TextArea />
      </Form.Item>

      <Upload
        beforeUpload={() => false}
        fileList={fileList}
        onChange={({ fileList }) => setFileList(fileList)}
      >
        <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
      </Upload>

      <Button htmlType="submit" type="primary" block loading={loading}>
        Tạo sản phẩm
      </Button>
    </Form>
  );
};

export default ProductForm;