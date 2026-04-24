import { Card, Table } from "antd";

const ProductSpecs = ({ specs }) => {

  const columns = [
    { title: "Thông số", dataIndex: "spec_name" },
    { title: "Giá trị", dataIndex: "spec_value" }
  ];

  return (
    <Card title="Thông số kỹ thuật" style={{ marginTop: 30 }}>
      <Table
        columns={columns}
        dataSource={specs}
        pagination={false}
        rowKey="id"
      />
    </Card>
  );
};

export default ProductSpecs;