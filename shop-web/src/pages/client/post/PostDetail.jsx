import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Spin, Empty } from "antd";

// Services
import postService from "../../../services/post.service";
import postImageService from "../../../services/postImage.service";

// Components
import PostHeader from "../../../components/client/blog/PostHeader";
import PostContent from "../../../components/client/blog/PostContent";
import PostGallery from "../../../components/client/blog/PostGallery";
import PostProducts from "../../../components/client/blog/PostProducts";
import RelatedPosts from "../../../components/client/blog/RelatedProducts";

const PostDetail = () => {
  const { slug } = useParams();

  const [post, setPost] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Lấy dữ liệu bài viết và hình ảnh đi kèm
   * Sử dụng useCallback để tránh tạo lại function mỗi khi re-render
   */
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Lấy chi tiết bài viết dựa trên slug
      const postRes = await postService.getPostBySlug(slug);
      const postData = postRes?.data?.data;

      if (!postData || !postData.id) {
        setPost(null);
        return;
      }

      setPost(postData);

      // 2. Lấy danh sách hình ảnh liên quan đến bài viết
      const imgRes = await postImageService.getPostImages({
        post_id: postData.id,
      });

      // Trích xuất mảng hình ảnh từ response
      const imageData = imgRes?.data?.data?.items || [];
      setImages(imageData);

    } catch (error) {
      console.error("Lỗi khi tải chi tiết bài viết:", error);
      setPost(null);
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      fetchData();
      // Cuộn lên đầu trang khi chuyển bài viết
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [slug, fetchData]);

  // Trạng thái đang tải - ĐÃ SỬA: thay tip bằng description
  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "400px" 
      }}>
        <Spin size="large" description="Đang tải bài viết..." />
      </div>
    );
  }

  // Trường hợp không tìm thấy bài viết
  if (!post) {
    return (
      <div style={{ padding: "100px 0", textAlign: "center" }}>
        <Empty description="Không tìm thấy bài viết" />
      </div>
    );
  }

  return (
    <div style={{ padding: "20px 40px", maxWidth: "1200px", margin: "0 auto" }}>
      <Row gutter={[32, 32]}>
        
        {/* Cột chính: Nội dung bài viết */}
        <Col xs={24} lg={16}>
          <article>
            {/* Header: Tiêu đề, ngày tháng, ảnh đại diện */}
            <PostHeader post={post} />
            
            {/* Nội dung chi tiết */}
            <PostContent content={post.content} />
            
            {/* Gallery ảnh liên quan */}
            {images.length > 0 && (
              <div style={{ marginTop: "30px" }}>
                <PostGallery images={images} />
              </div>
            )}

            {/* Các bài viết cùng chủ đề */}
            <div style={{ 
              marginTop: "50px", 
              borderTop: "1px solid #f0f0f0", 
              paddingTop: "30px" 
            }}>
              <RelatedPosts
                topicId={post.topic_id}
                currentPostId={post.id}
              />
            </div>
          </article>
        </Col>

        {/* Cột phụ: Sản phẩm liên quan hoặc Sidebar */}
        <Col xs={24} lg={8}>
          <aside>
            <PostProducts postId={post.id} />
          </aside>
        </Col>

      </Row>
    </div>
  );
};

export default PostDetail;