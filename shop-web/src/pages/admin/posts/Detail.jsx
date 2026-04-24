import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  Card,
  Button,
  Upload,
  Image,
  Popconfirm,
  Select,
  List
} from "antd";

import {
  ArrowLeftOutlined,
  UploadOutlined,
  DeleteOutlined
} from "@ant-design/icons";

import postService from "../../../services/post.service";
import postImageService from "../../../services/postImage.service";
import postProductService from "../../../services/postProduct.service";
import productService from "../../../services/product.service";

import { useToast } from "../../../context/ToastProvider";

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [post, setPost] = useState(null);
  const [images, setImages] = useState([]);
  const [fileList, setFileList] = useState([]);

  const [products, setProducts] = useState([]);
  const [postProducts, setPostProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // 🔥 Tạo map product_id -> product (tối ưu)
  const productMap = useMemo(() => {
    const map = {};
    (products || []).forEach(p => {
      map[p.id] = p;
    });
    return map;
  }, [products]);

  // ================= FETCH POST =================
  const fetchPost = useCallback(async () => {
    try {
      const res = await postService.getPostById(id);
      const postData = res?.data?.data;

      setPost(postData || null);
      setImages(postData?.PostImages || []);
    } catch (error) {
      toast.error("Không tải được bài viết");
    }
  }, [id, toast]);

  // ================= FETCH PRODUCT =================
  const fetchProducts = useCallback(async () => {
    try {
      const res = await productService.getProducts();
      const data = res?.data?.data?.items;

      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Không tải được sản phẩm");
    }
  }, [toast]);

  // ================= FETCH POST PRODUCT =================
  const fetchPostProducts = useCallback(async () => {
    try {
      const res = await postProductService.getPostProducts({
        post_id: id,
      });

      const data = res?.data?.data?.items;

      setPostProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Không tải được product của bài viết");
    }
  }, [id, toast]);

  // Chạy lần đầu khi mount hoặc khi id thay đổi
  useEffect(() => {
    fetchPost();
    fetchProducts();
    fetchPostProducts();
  }, [fetchPost, fetchProducts, fetchPostProducts]);

  // ================= UPLOAD IMAGE =================
  const handleUpload = async () => {
    if (fileList.length === 0) {
      toast.warning("Chọn ảnh trước");
      return;
    }

    try {
      for (let file of fileList) {
        await postImageService.uploadImage(id, file.originFileObj);
      }

      toast.success("Upload ảnh thành công");
      setFileList([]);
      fetchPost(); // Gọi lại hàm đã được memoized
    } catch (error) {
      toast.error("Upload ảnh thất bại");
    }
  };

  // ================= DELETE IMAGE =================
  const handleDeleteImage = async (imageId) => {
    try {
      await postImageService.delete(imageId);
      toast.success("Xóa ảnh thành công");
      fetchPost();
    } catch (error) {
      toast.error("Xóa ảnh thất bại");
    }
  };

  // ================= ADD PRODUCT =================
  const handleAddProduct = async () => {
    if (!selectedProduct) {
      toast.warning("Chọn sản phẩm");
      return;
    }

    try {
      await postProductService.createPostProduct({
        post_id: id,
        product_id: selectedProduct,
      });

      toast.success("Thêm sản phẩm vào bài viết");
      setSelectedProduct(null);
      fetchPostProducts();
    } catch (error) {
      toast.error("Thêm thất bại");
    }
  };

  // ================= DELETE PRODUCT =================
  const handleDeleteProduct = async (product_id) => {
    try {
      await postProductService.deletePostProduct(id, product_id);
      toast.success("Xóa sản phẩm khỏi bài viết");
      fetchPostProducts();
    } catch (error) {
      toast.error("Xóa thất bại");
    }
  };

  if (!post) return <Card loading />;

  return (
    <div style={{ padding: 24 }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16 }}
      >
        Quay lại
      </Button>

      <Card title={post.title}>
        {post.thumbnail && (
          <Image
            src={`http://tbtshoplt.xyz${post.thumbnail}`}
            width={200}
          />
        )}
        <p style={{ marginTop: 20 }}>{post.content}</p>
      </Card>

      {/* GALLERY */}
      <Card title="Gallery ảnh" style={{ marginTop: 24 }}>
        <Image.PreviewGroup>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,120px)",
              gap: 12,
            }}
          >
            {(images || []).map((img) => (
              <div key={img.id} style={{ position: "relative" }}>
                <Image
                  width={120}
                  height={120}
                  src={`http://tbtshoplt.xyz${img.image}`}
                  style={{ objectFit: "cover", borderRadius: 8 }}
                />

                <Popconfirm
                  title="Xóa ảnh này?"
                  onConfirm={() => handleDeleteImage(img.id)}
                >
                  <DeleteOutlined
                    style={{
                      position: "absolute",
                      top: 5,
                      right: 5,
                      color: "red",
                      background: "#fff",
                      borderRadius: "50%",
                      padding: 4,
                      cursor: "pointer",
                    }}
                  />
                </Popconfirm>
              </div>
            ))}
          </div>
        </Image.PreviewGroup>
      </Card>

      {/* UPLOAD */}
      <Card title="Thêm ảnh" style={{ marginTop: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Upload
            multiple
            beforeUpload={() => false}
            listType="picture-card"
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
          >
            <div>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>Chọn ảnh</div>
            </div>
          </Upload>

          <Button type="primary" onClick={handleUpload} style={{ width: 120 }}>
            Upload
          </Button>
        </div>
      </Card>

      {/* PRODUCT */}
      <Card title="Sản phẩm liên quan" style={{ marginTop: 24 }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <Select
            style={{ width: 300 }}
            placeholder="Chọn sản phẩm"
            value={selectedProduct}
            onChange={(value) => setSelectedProduct(value)}
            options={(products || []).map((p) => ({
              label: p.name,
              value: p.id,
            }))}
          />

          <Button type="primary" onClick={handleAddProduct}>
            Thêm
          </Button>
        </div>

        <List
          bordered
          dataSource={postProducts || []}
          renderItem={(item) => {
            const product = productMap[item.product_id];

            return (
              <List.Item
                actions={[
                  <Popconfirm
                    key="delete"
                    title="Xóa sản phẩm?"
                    onConfirm={() =>
                      handleDeleteProduct(item.product_id)
                    }
                  >
                    <DeleteOutlined style={{ color: "red" }} />
                  </Popconfirm>,
                ]}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {product?.thumbnail && (
                    <Image
                      src={`http://tbtshoplt.xyz${product.thumbnail}`}
                      width={50}
                      height={50}
                      style={{ objectFit: "cover", borderRadius: 6 }}
                    />
                  )}

                  <span>
                    {product ? product.name : `ID: ${item.product_id}`}
                  </span>
                </div>
              </List.Item>
            );
          }}
        />
      </Card>
    </div>
  );
};

export default Detail;