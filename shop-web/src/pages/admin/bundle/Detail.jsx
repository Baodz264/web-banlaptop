import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Card, Descriptions, message, Spin, Table, Tag, Tooltip, Image } from "antd";

import BundleService from "../../../services/bundle.service";
import BundleItemService from "../../../services/bundleItem.service";
import variantService from "../../../services/variant.service";

const API_URL = "http://tbtshoplt.xyz";

const Detail = () => {
  const { id } = useParams();
  const [bundle, setBundle] = useState(null);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBundle = useCallback(async () => {
    try {
      setLoading(true);

      // 1. Lấy thông tin Bundle
      const res = await BundleService.getBundleById(id);
      const bundleData = res?.data?.data || res?.data;
      setBundle(bundleData);

      // 2. Lấy danh sách Item (Để lấy variant_id)
      const itemRes = await BundleItemService.getItemsByBundle(id);
      const items = itemRes?.data?.data || itemRes?.data || [];

      // 3. Lấy chi tiết từng Variant
      const variantList = await Promise.all(
        items.map(async (item) => {
          try {
            const vRes = await variantService.getById(item.variant_id);
            const v = vRes?.data?.data || vRes?.data;
            
            // Xử lý hiển thị thuộc tính (Ram, SSD...)
            const attrs = v?.AttributeValues?.map(av => 
              `${av.Attribute?.name || ''}: ${av.value}`
            ).join(", ");

            return {
              ...v,
              // Ưu tiên v.image, nếu null thì lấy thumbnail của Product
              displayImage: v?.image || v?.Product?.thumbnail,
              // Tên đầy đủ
              displayName: `${v?.Product?.name || 'Sản phẩm'}${attrs ? ` (${attrs})` : ""} - ${v?.sku || ''}`,
              // Lấy trường stock từ log
              displayStock: v?.stock ?? 0
            };
          } catch (err) {
            return null;
          }
        })
      );

      setVariants(variantList.filter(v => v !== null));

    } catch (error) {
      console.error("Lỗi:", error);
      message.error("Không tải được thông tin");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchBundle();
  }, [id, fetchBundle]);

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "displayImage",
      key: "displayImage",
      width: 100,
      render: (img) => (
        img ? (
          <Image
            src={img.startsWith('http') ? img : `${API_URL}${img}`}
            width={60}
            height={60}
            style={{ objectFit: "cover", borderRadius: "4px", border: "1px solid #f0f0f0" }}
            fallback="https://placehold.co/60x60?text=No+Image"
          />
        ) : (
          <div style={{ width: 60, height: 60, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
            No Image
          </div>
        )
      )
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "displayName",
      key: "displayName",
      render: (text) => <Tooltip title={text}><b>{text}</b></Tooltip>
    },
    { 
      title: "Giá gốc", 
      dataIndex: "price", 
      key: "price",
      render: (v) => <b style={{ color: '#f5222d' }}>{Number(v || 0).toLocaleString()} ₫</b>
    },
    { 
      title: "Tồn kho", 
      dataIndex: "displayStock", 
      key: "displayStock",
      width: 100,
      render: (stock) => (
        <Tag color={stock > 0 ? "blue" : "red"}>
          {stock > 0 ? `Còn ${stock}` : "Hết hàng"}
        </Tag>
      )
    }
  ];

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <Spin size="large" description="Đang tải dữ liệu bundle..." />
    </div>
  );

  return (
    <Card title="Chi tiết Bundle" variant="bordered">
      {bundle && (
        <Descriptions bordered column={1} style={{ marginBottom: 20 }}>
          <Descriptions.Item label="ID">{bundle.id}</Descriptions.Item>
          <Descriptions.Item label="Tên bundle">{bundle.name}</Descriptions.Item>
          <Descriptions.Item label="Loại giảm">
            {/* Sửa logic: log của bạn trả về 'percent' */}
            {bundle.discount_type === 'percent' ? 'Giảm theo %' : 'Giảm tiền cố định'}
          </Descriptions.Item>
          <Descriptions.Item label="Giá trị giảm">
            <Tag color="volcano" style={{ fontSize: '14px' }}>
              {bundle.discount_type === 'percent' 
                ? `${bundle.discount_value}%` 
                : `${Number(bundle.discount_value || 0).toLocaleString()} ₫`}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian">
            {new Date(bundle.start_date).toLocaleDateString('vi-VN')}
            {bundle.end_date ? ` đến ${new Date(bundle.end_date).toLocaleDateString('vi-VN')}` : " (Không thời hạn)"}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            {bundle.status === 1 ? <Tag color="green">Đang hoạt động</Tag> : <Tag color="red">Đang tắt</Tag>}
          </Descriptions.Item>
        </Descriptions>
      )}

      <Card title="Danh sách sản phẩm áp dụng" type="inner" variant="bordered">
        <Table
          rowKey={(record) => record.id}
          columns={columns}
          dataSource={variants}
          pagination={false}
          bordered
        />
      </Card>
    </Card>
  );
};

export default Detail;