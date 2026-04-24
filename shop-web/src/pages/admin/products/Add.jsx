import { Card, Typography, Tabs } from "antd";
import { PlusOutlined, FormOutlined, FileExcelOutlined } from "@ant-design/icons";

import ProductForm from "../../../components/admin/products/add/ProductForm";
import ProductExcelImport from "../../../components/admin/products/add/ProductExcelImport";

const { Title } = Typography;

const Add = () => {
  // Định nghĩa mảng items cho Tabs thay vì dùng TabPane
  const tabItems = [
    {
      key: "1",
      label: (
        <span>
          <FormOutlined /> Nhập tay
        </span>
      ),
      children: <ProductForm />,
    },
    {
      key: "2",
      label: (
        <span>
          <FileExcelOutlined /> Import Excel
        </span>
      ),
      children: <ProductExcelImport />,
    },
  ];

  return (
    <Card className="max-w-5xl mx-auto mt-10">
      <Title level={3}>
        <PlusOutlined /> Thêm sản phẩm
      </Title>

      <Tabs 
        defaultActiveKey="1" 
        items={tabItems} 
      />
    </Card>
  );
};

export default Add;