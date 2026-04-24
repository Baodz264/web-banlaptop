import { useState } from "react";
import { Row, Col, Upload, Button, Card, Image, Popconfirm } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import productImageService from "../../../../services/productImage.service";
import { useToast } from "../../../../context/ToastProvider";

const ProductImages = ({ productId, images, reload }) => {
  const toast = useToast();
  const [fileList, setFileList] = useState([]);

  const handleUpload = async () => {
    if (fileList.length === 0) {
      toast.warning("Chọn ảnh trước khi upload");
      return;
    }

    try {
      // Sử dụng Promise.all để upload song song sẽ nhanh hơn vòng lặp for tuần tự
      const uploadPromises = fileList.map((file) => {
        const formData = new FormData();
        formData.append("product_id", productId);
        formData.append("image", file.originFileObj);
        return productImageService.create(formData);
      });

      await Promise.all(uploadPromises);

      toast.success("Upload ảnh thành công");
      setFileList([]);
      reload();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload ảnh thất bại");
    }
  };

  const handleDelete = async (id) => {
    try {
      await productImageService.delete(id);
      toast.success("Xóa ảnh thành công");
      reload();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Xóa ảnh thất bại");
    }
  };

  return (
    <>
      <div style={{ marginBottom: 16 }}>
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

        <Button 
          type="primary" 
          onClick={handleUpload} 
          disabled={fileList.length === 0}
          icon={<UploadOutlined />}
        >
          Bắt đầu Upload
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {images.map((img) => (
          <Col xs={24} sm={12} md={8} lg={6} key={img.id}>
            <Card
              hoverable
              /* ✅ Xóa bỏ hoàn toàn bodyStyle và styles.body 
                 Vì chúng ta chỉ dùng cover và actions, body để trống nên không cần set style 
              */
              cover={
                <div
                  style={{
                    width: "100%",
                    height: 200,
                    overflow: "hidden",
                    background: "#f0f0f0",
                  }}
                >
                  <Image
                    src={`http://tbtshoplt.xyz${img.image}`}
                    preview={true}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              }
              actions={[
                <Popconfirm
                  key="delete-action" // Thêm key để hết warning React
                  title="Bạn có chắc chắn muốn xóa ảnh này?"
                  onConfirm={() => handleDelete(img.id)}
                  okText="Xóa"
                  cancelText="Hủy"
                  okButtonProps={{ danger: true }}
                >
                  <DeleteOutlined style={{ color: "red" }} />
                </Popconfirm>,
              ]}
            />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default ProductImages;