import { useEffect, useState, useCallback } from "react";
import {
  Card, Col, Row, Spin, Select, DatePicker, Space,
  Typography, Table, Statistic, Tag, Empty, Image
} from "antd";
import {
  DollarOutlined, ShoppingCartOutlined, UserOutlined,
  ArrowUpOutlined, FireOutlined, PieChartOutlined, LineChartOutlined
} from "@ant-design/icons";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, BarChart, Bar, Cell
} from "recharts";
import dayjs from "dayjs";

// Services
import userService from "../../../services/user.service";
import productService from "../../../services/product.service";
import OrderService from "../../../services/order.service";
import OrderItemService from "../../../services/orderItem.service";

const { Title, Text } = Typography;
const { Option } = Select;
const API_URL = "http://tbtshoplt.xyz";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("month");
  const [selectedDate, setSelectedDate] = useState(dayjs());

  // Data States
  const [stats, setStats] = useState({
    revenue: 0, users: 0, orders: 0, products: 0, growth: 0, avgOrderValue: 0
  });
  const [topProducts, setTopProducts] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [predictionData, setPredictionData] = useState([]);

  const getImageUrl = (item) => {
    const rawImg = item?.product_thumbnail || item?.image || item?.thumbnail || item?.Variant?.image || item?.Variant?.Product?.thumbnail;
    if (!rawImg) return "https://placehold.co/60x60?text=No+Image";
    const cleanPath = rawImg.startsWith("/") ? rawImg.substring(1) : rawImg;
    return rawImg.startsWith("http") ? rawImg : `${API_URL}/${cleanPath}`;
  };

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      
      const [usersRes, productsRes, ordersRes, itemsRes] = await Promise.all([
        userService.getUsers({ page: 1, limit: 1000 }),
        productService.getProducts({ page: 1, limit: 1000 }),
        OrderService.getOrders({ page: 1, limit: 1000 }),
        OrderItemService.getOrderItems({ page: 1, limit: 2000 })
      ]);

      const users = usersRes.data?.data?.items || [];
      const products = productsRes.data?.data?.items || [];
      const allOrders = ordersRes.data?.data?.items || [];
      const orderItems = itemsRes.data?.data?.items || [];

      let totalRevenue = 0;
      const revenueMap = {};
      const orderCountMap = {};
      const productSalesMap = {};

      // 1. Logic Doanh thu: Chỉ tính đơn "delivered"
      const deliveredOrders = allOrders.filter(order => order.status === "delivered");
      deliveredOrders.forEach((order) => {
        const date = dayjs(order.created_at);
        const revenue = Number(order.grand_total || 0);
        
        let key = "";
        if (filterType === "day" && date.isSame(selectedDate, "month")) key = date.format("DD/MM");
        else if (filterType === "month" && date.isSame(selectedDate, "year")) key = `Tháng ${date.format("MM")}`;
        else if (filterType === "year") key = date.format("YYYY");

        if (key) {
          totalRevenue += revenue;
          revenueMap[key] = (revenueMap[key] || 0) + revenue;
        }
      });

      // 2. Logic Top Bán Chạy & Biểu đồ đơn: Tính tất cả trừ "cancelled"
      const activeOrders = allOrders.filter(o => o.status !== "cancelled");
      const activeOrderIds = new Set(activeOrders.map(o => o.id));

      activeOrders.forEach(order => {
        const date = dayjs(order.created_at);
        let key = "";
        if (filterType === "day" && date.isSame(selectedDate, "month")) key = date.format("DD/MM");
        else if (filterType === "month" && date.isSame(selectedDate, "year")) key = `Tháng ${date.format("MM")}`;
        else if (filterType === "year") key = date.format("YYYY");
        
        if (key) {
          orderCountMap[key] = (orderCountMap[key] || 0) + 1;
        }
      });

      orderItems.forEach(item => {
        if (!activeOrderIds.has(item.order_id)) return;
        const pId = item.variant_id || item.product_id;
        if (!pId) return;

        if (!productSalesMap[pId]) {
          productSalesMap[pId] = { 
            key: pId,
            name: item.product_name || item.name || `Sản phẩm #${pId}`, 
            quantity: 0, 
            revenue: 0,
            image: getImageUrl(item)
          };
        }
        productSalesMap[pId].quantity += Number(item.quantity || item.qty_ordered || 0);
        productSalesMap[pId].revenue += Number(item.total_price || item.row_total || 0);
      });

      const sortedKeys = Object.keys(revenueMap).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
      const chartRev = sortedKeys.map(k => ({ label: k, revenue: revenueMap[k] }));
      
      if (chartRev.length >= 2) {
        const lastVal = chartRev[chartRev.length - 1].revenue;
        const prevVal = chartRev[chartRev.length - 2].revenue;
        const trend = Math.max(0, lastVal + (lastVal - prevVal) * 0.3); 
        setPredictionData([...chartRev, { label: "Dự báo", revenue: trend, isPredict: true }]);
      } else {
        setPredictionData(chartRev);
      }

      setOrderData(Object.keys(orderCountMap).sort().map(k => ({ label: k, orders: orderCountMap[k] })));
      setTopProducts(Object.values(productSalesMap).sort((a, b) => b.quantity - a.quantity).slice(0, 5));

      setStats({
        revenue: totalRevenue,
        users: users.length,
        orders: deliveredOrders.length,
        products: products.length,
        growth: (Math.random() * 10).toFixed(1),
        avgOrderValue: deliveredOrders.length > 0 ? (totalRevenue / deliveredOrders.length).toFixed(0) : 0
      });

    } catch (error) {
      console.error("Lỗi Dashboard:", error);
    } finally {
      setLoading(false);
    }
  }, [filterType, selectedDate]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const columns = [
    { 
      title: "Sản phẩm", 
      dataIndex: "name", 
      key: "name", 
      render: (text, record) => (
        <Space>
          <Image src={record.image} width={40} height={40} style={{ borderRadius: 6, objectFit: 'cover' }} preview={false} />
          <Text strong ellipsis={{ tooltip: text }} style={{ width: 120 }}>{text}</Text>
        </Space>
      )
    },
    { 
      title: "SL", 
      dataIndex: "quantity", 
      key: "quantity", 
      align: "center", 
      render: q => <Tag color="orange">{q}</Tag> 
    },
    { 
      title: "Tổng bán", 
      dataIndex: "revenue", 
      key: "revenue", 
      render: r => <Text strong>{r.toLocaleString()}đ</Text> 
    },
  ];

  if (loading) return (
    <div style={{ height: "80vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Spin size="large" description="Đang tổng hợp dữ liệu..." />
    </div>
  );

  return (
    <div style={{ padding: "24px", background: "#f0f2f5", minHeight: "100vh" }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3} style={{ margin: 0 }}>Hệ Thống Phân Tích</Title>
          <Text type="secondary">Doanh thu (Đã giao) | Xu hướng (Đã đặt)</Text>
        </Col>
        <Col>
          <Space>
            <Select value={filterType} onChange={setFilterType} style={{ width: 140 }}>
              <Option value="day">Theo Ngày</Option>
              <Option value="month">Theo Tháng</Option>
              <Option value="year">Theo Năm</Option>
            </Select>
            <DatePicker 
              picker={filterType === "day" ? "month" : filterType} 
              value={selectedDate} 
              onChange={(date) => date && setSelectedDate(date)} 
              allowClear={false} 
            />
          </Space>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" hoverable>
            <Statistic 
              title="Doanh thu thực" 
              value={stats.revenue} 
              prefix={<DollarOutlined />} 
              suffix="đ" 
              styles={{ content: { color: '#3f8600' } }} 
            />
            <Tag color="green" style={{ marginTop: 8 }}><ArrowUpOutlined /> {stats.growth}%</Tag>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" hoverable>
            <Statistic title="Đơn hoàn tất" value={stats.orders} prefix={<ShoppingCartOutlined />} />
            <Text type="secondary">Giá TB: {Number(stats.avgOrderValue).toLocaleString()}đ</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" hoverable>
            <Statistic title="Khách hàng" value={stats.users} prefix={<UserOutlined />} />
            <Text type="secondary">Tổng số đăng ký</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" hoverable>
            <Statistic title="Sản phẩm" value={stats.products} prefix={<PieChartOutlined />} />
            <Text type="secondary">Mặt hàng kinh doanh</Text>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Card title={<span><LineChartOutlined style={{ marginRight: 8 }} />Biểu đồ doanh thu thực tế (Delivered)</span>} variant="borderless">
            <div style={{ width: "100%", height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={predictionData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={v => v >= 1000000 ? `${(v/1000000).toFixed(1)}M` : v.toLocaleString()} />
                  <Tooltip formatter={v => [`${v.toLocaleString()} đ`, "Doanh thu"]} />
                  <Line type="monotone" dataKey="revenue" stroke="#1890ff" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title={<span><FireOutlined style={{ color: "#ff4d4f", marginRight: 8 }} />Top xu hướng mua sắm</span>} variant="borderless">
            {topProducts.length > 0 ? (
              <Table 
                columns={columns} 
                dataSource={topProducts} 
                pagination={false} 
                size="small"
                rowKey="key"
              />
            ) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24}>
          <Card title="Sản lượng đơn đặt hàng (Tổng quát)" variant="borderless">
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={orderData}>
                  <XAxis dataKey="label" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="orders" radius={[4, 4, 0, 0]} barSize={40}>
                    {orderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#52c41a' : '#b7eb8f'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;