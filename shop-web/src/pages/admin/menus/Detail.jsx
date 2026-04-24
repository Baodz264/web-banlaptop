import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  Card,
  Tag,
  Descriptions,
  Button
} from "antd";

import { ArrowLeftOutlined } from "@ant-design/icons";

import menuService from "../../../services/menu.service";

const Detail = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [menu, setMenu] = useState(null);

  useEffect(() => {

    const fetch = async () => {

      const res = await menuService.getMenuById(id);

      setMenu(res.data.data);

    };

    fetch();

  }, [id]);

  if (!menu) return <Card loading />;

  return (

    <div style={{ padding: 24 }}>

      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
      >
        Quay lại
      </Button>

      <Card title="Menu Detail" style={{ marginTop: 20 }}>

        <Descriptions bordered column={1}>

          <Descriptions.Item label="ID">
            {menu.id}
          </Descriptions.Item>

          <Descriptions.Item label="Name">
            {menu.name}
          </Descriptions.Item>

          <Descriptions.Item label="Link">
            {menu.link || "N/A"}
          </Descriptions.Item>

          <Descriptions.Item label="Parent">
            {menu.parent?.name || "Root"}
          </Descriptions.Item>

          <Descriptions.Item label="Position">
            {menu.position}
          </Descriptions.Item>

          <Descriptions.Item label="Status">
            {menu.status === 1
              ? <Tag color="green">Active</Tag>
              : <Tag color="red">Hidden</Tag>}
          </Descriptions.Item>

        </Descriptions>

      </Card>

    </div>

  );

};

export default Detail;