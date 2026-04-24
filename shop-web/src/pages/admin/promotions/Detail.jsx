import { useEffect, useState, useCallback } from "react"; // Thêm useCallback
import { useParams, useNavigate } from "react-router-dom";

import {
  Card,
  Button,
  Typography,
  Table,
  Tag,
  Row,
  Col,
  Space,
  message,
  Divider
} from "antd";

import {
  ArrowLeftOutlined,
  GiftOutlined
} from "@ant-design/icons";

import dayjs from "dayjs";

import promotionService from "../../../services/promotion.service";
import promotionItemService from "../../../services/promotionItem.service";

const { Title, Text } = Typography;

const BASE_URL = "http://tbtshoplt.xyz";

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [promotion, setPromotion] = useState(null);
  const [items, setItems] = useState([]);

  // ================= FETCH DATA =================
  // Sử dụng useCallback để tránh lỗi missing dependency và tối ưu hiệu năng
  const fetchData = useCallback(async () => {
    try {
      const res = await promotionService.getPromotionById(id);
      setPromotion(res.data.data);

      const resItems = await promotionItemService.getItems({
        promotion_id: id
      });

      setItems(resItems.data.data);
    } catch (err) {
      console.error(err);
      message.error("Không tải được thông tin khuyến mãi");
    }
  }, [id]); // fetchData chỉ thay đổi khi id thay đổi

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Thêm fetchData vào dependency array

  if (!promotion) return <Card loading style={{ margin: 30 }} />;

  // ================= HELPER =================
  const getImage = (r) => {
    return (
      r.Product?.thumbnail ||
      r.Brand?.logo ||
      r.Category?.image ||
      null
    );
  };

  const getName = (r) => {
    return (
      r.Product?.name ||
      r.Brand?.name ||
      r.Category?.name ||
      "Tất cả sản phẩm"
    );
  };

  const getId = (r) => {
    return (
      r.product_id ||
      r.brand_id ||
      r.category_id ||
      "-"
    );
  };

  // ================= NAVIGATE =================
  const goToDetail = (record) => {
    if (record.apply_type === "product" && record.product_id) {
      navigate(`/admin/products/detail/${record.product_id}`);
    } else if (record.apply_type === "brand" && record.brand_id) {
      navigate(`/admin/brands/detail/${record.brand_id}`);
    } else if (record.apply_type === "category" && record.category_id) {
      navigate(`/admin/categories/detail/${record.category_id}`);
    }
  };

  // ================= TABLE =================
  const columns = [
    {
      title: "Loại áp dụng",
      dataIndex: "apply_type",
      render: (v) => {
        const map = {
          product: { color: "blue", text: "Sản phẩm" },
          brand: { color: "green", text: "Thương hiệu" },
          category: { color: "purple", text: "Danh mục" },
          all: { color: "gold", text: "Tất cả sản phẩm" }
        };
        return <Tag color={map[v]?.color}>{map[v]?.text}</Tag>;
      }
    },
    {
      title: "Hình ảnh",
      render: (r) => {
        const img = getImage(r);
        if (!img) return "Không có";
        return (
          <img
            src={`${BASE_URL}${img}`}
            alt=""
            style={{
              width: 50,
              height: 50,
              objectFit: "cover",
              borderRadius: 6
            }}
          />
        );
      }
    },
    {
      title: "Tên",
      render: (r) => getName(r)
    },
    {
      title: "ID",
      render: (r) => getId(r)
    }
  ];

  return (
    <div style={{ padding: 30, maxWidth: 1200, margin: "auto" }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 20 }}
      >
        Quay lại
      </Button>

      {/* ================= THÔNG TIN ================= */}
      <Card style={{ borderRadius: 12 }}>
        <Space align="center" style={{ marginBottom: 10 }}>
          <GiftOutlined style={{ fontSize: 22 }} />
          <Title level={3} style={{ margin: 0 }}>
            Chi tiết khuyến mãi
          </Title>
        </Space>

        <Divider />

        <Row gutter={16}>
          <Col span={12}>
            <Text strong>ID:</Text>
            <div>{promotion.id}</div>
          </Col>

          <Col span={12}>
            <Text strong>Tên chương trình:</Text>
            <div>{promotion.name}</div>
          </Col>

          <Col span={12} style={{ marginTop: 12 }}>
            <Text strong>Loại giảm:</Text>
            <div>
              <Tag color="blue">
                {promotion.type === "percent"
                  ? "Giảm theo %"
                  : "Giảm tiền"}
              </Tag>
            </div>
          </Col>

          <Col span={12} style={{ marginTop: 12 }}>
            <Text strong>Giá trị:</Text>
            <div>
              <Tag color="green">
                {promotion.type === "percent"
                  ? `${promotion.value}%`
                  : `${Number(promotion.value).toLocaleString("vi-VN")} đ`}
              </Tag>
            </div>
          </Col>

          <Col span={12} style={{ marginTop: 12 }}>
            <Text strong>Giới hạn sử dụng:</Text>
            <div>
              {promotion.usage_limit || "Không giới hạn"}
            </div>
          </Col>

          <Col span={12} style={{ marginTop: 12 }}>
            <Text strong>Trạng thái:</Text>
            <div>
              {promotion.status === 1
                ? <Tag color="green">Hoạt động</Tag>
                : <Tag color="red">Ngưng</Tag>}
            </div>
          </Col>

          <Col span={12} style={{ marginTop: 12 }}>
            <Text strong>Ngày bắt đầu:</Text>
            <div>
              {promotion.start_date
                ? dayjs(promotion.start_date).format("DD/MM/YYYY HH:mm")
                : "-"}
            </div>
          </Col>

          <Col span={12} style={{ marginTop: 12 }}>
            <Text strong>Ngày kết thúc:</Text>
            <div>
              {promotion.end_date
                ? dayjs(promotion.end_date).format("DD/MM/YYYY HH:mm")
                : "-"}
            </div>
          </Col>
        </Row>
      </Card>

      {/* ================= DANH SÁCH ================= */}
      <Card
        title="Danh sách áp dụng khuyến mãi"
        style={{
          marginTop: 24,
          borderRadius: 12
        }}
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={items}
          pagination={false}
          rowClassName={() => "clickable-row"}
          onRow={(record) => ({
            onClick: () => goToDetail(record)
          })}
        />
      </Card>
    </div>
  );
};

export default Detail;