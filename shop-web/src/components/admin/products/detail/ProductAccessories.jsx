import { useEffect, useState, useCallback } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  Select,
  Popconfirm,
  Image,
  Typography,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

import productService from "../../../../services/product.service";
import productAccessoryService from "../../../../services/productAccessory.service";
import { useToast } from "../../../../context/ToastProvider";

const { Option } = Select;
const { Text } = Typography;
const API_URL = "http://tbtshoplt.xyz";

const ProductAccessories = ({ productId }) => {
  const toast = useToast();

  const [accessories, setAccessories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  // ================= NORMALIZE =================
  const normalize = (res) => {
    return (
      res?.data?.data?.items ||
      res?.data?.data ||
      res?.data ||
      []
    );
  };

  // ================= FETCH ACCESSORIES =================
  const fetchAccessories = useCallback(async () => {
    try {
      const res = await productAccessoryService.getByProduct(productId);
      const list = normalize(res);
      setAccessories(list);
    } catch (err) {
      toast.error("Không tải được phụ kiện");
    }
  }, [productId, toast]);

  // ================= FETCH PRODUCTS (ONLY ACCESSORY) =================
  const fetchProducts = useCallback(async () => {
    setLoading(true);

    try {
      const res = await productService.getProducts({
        limit: 200,
        page: 1,
      });

      const list = normalize(res);

      // CHỈ LẤY ACCESSORY (id 16–28 trong DB bạn)
      const onlyAccessories = list.filter(
        (p) => p?.product_type === "accessory"
      );

      setProducts(onlyAccessories);
    } catch (err) {
      toast.error("Không tải được sản phẩm");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (productId) {
      fetchAccessories();
      fetchProducts();
    }
  }, [productId, fetchAccessories, fetchProducts]);

  // ================= ADD =================
  const addAccessory = async () => {
    if (!selected) {
      toast.warning("Vui lòng chọn phụ kiện");
      return;
    }

    try {
      await productAccessoryService.add({
        product_id: productId,
        accessory_id: selected,
      });

      toast.success("Thêm phụ kiện thành công");
      setOpen(false);
      setSelected(null);
      fetchAccessories();
    } catch (err) {
      toast.error("Thêm thất bại");
    }
  };

  // ================= DELETE =================
  const removeAccessory = async (accessory_id) => {
    try {
      await productAccessoryService.delete(productId, accessory_id);
      toast.success("Xoá thành công");
      fetchAccessories();
    } catch (err) {
      toast.error("Xoá thất bại");
    }
  };

  // ================= TABLE COLUMNS =================
  const columns = [
    {
      title: "Hình",
      render: (_, r) =>
        r?.accessory?.thumbnail ? (
          <Image
            src={API_URL + r.accessory.thumbnail}
            alt={r.accessory.name || "Accessory"}
            width={50}
            height={50}
            style={{ objectFit: "cover", borderRadius: 6 }}
          />
        ) : (
          "—"
        ),
    },
    {
      title: "Tên phụ kiện",
      render: (_, r) => (
        <Text strong>{r?.accessory?.name || "—"}</Text>
      ),
    },
    {
      title: "Thao tác",
      width: 80,
      align: "center",
      render: (_, r) => (
        <Popconfirm
          title="Xoá phụ kiện?"
          onConfirm={() => removeAccessory(r.accessory_id)}
          okText="Có"
          cancelText="Không"
        >
          <Button danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <Card
      title="Danh sách phụ kiện"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setOpen(true)}
        >
          Thêm phụ kiện
        </Button>
      }
    >
      <Table
        rowKey={(r) => r.accessory_id}
        columns={columns}
        dataSource={accessories}
        loading={loading}
        pagination={false}
      />

      <Modal
        open={open}
        title="Chọn phụ kiện"
        onCancel={() => setOpen(false)}
        onOk={addAccessory}
        okText="Thêm"
        cancelText="Hủy"
      >
        <Select
          showSearch
          style={{ width: "100%" }}
          placeholder="Chọn phụ kiện"
          value={selected}
          onChange={setSelected}
          optionFilterProp="children"
        >
          {products.map((p) => (
            <Option key={p.id} value={p.id}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <img
                  src={API_URL + p.thumbnail}
                  alt={p.name}
                  style={{
                    width: 35,
                    height: 35,
                    objectFit: "cover",
                    borderRadius: 6,
                  }}
                />
                <span>{p.name}</span>
              </div>
            </Option>
          ))}
        </Select>
      </Modal>
    </Card>
  );
};

export default ProductAccessories;