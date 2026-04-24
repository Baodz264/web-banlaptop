import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Typography, Skeleton } from "antd";
import categoryService from "../../../services/category.service";

const { Title, Text } = Typography;

function Category() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getCategories({ status: 1 });
      setCategories(res?.data?.data?.items || []);
    } catch (error) {
      console.error("Load category error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div style={{ padding: "40px 0" }}>
      <div className="container">
        
        {/* HEADER giống SaleProduct */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 30,
          }}
        >
          <Title level={2} style={{ margin: 0 }}>
            Danh mục sản phẩm
          </Title>

          <Link to="/category" className="view-all-link">
            Xem tất cả →
          </Link>
        </div>

        {/* CONTENT */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          }}
        >
          <Row gutter={[0, 0]}>
            {loading
              ? Array(12).fill(0).map((_, i) => (
                  <Col key={i} xs={8} sm={6} md={4} lg={3}>
                    <div style={{ padding: 24, textAlign: "center" }}>
                      <Skeleton.Avatar active size={64} shape="circle" />
                      <Skeleton.Input
                        active
                        size="small"
                        style={{ marginTop: 12, width: "80%" }}
                      />
                    </div>
                  </Col>
                ))
              : categories.map((item) => (
                  <Col key={item.id} xs={8} sm={6} md={4} lg={3}>
                    <Link
                      to={`/products/category/${item.slug}`}
                      className="category-card"
                    >
                      <div className="icon-box">
                        <img
                          src={
                            item.image
                              ? `http://tbtshoplt.xyz${item.image}`
                              : "/no-image.png"
                          }
                          alt={item.name}
                        />
                      </div>

                      <Text className="category-name">
                        {item.name}
                      </Text>
                    </Link>
                  </Col>
                ))}
          </Row>
        </div>
      </div>

      {/* CSS */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .view-all-link {
          color: #8c8c8c;
          font-weight: 500;
          transition: all 0.3s;
          padding: 8px 16px;
          border-radius: 8px;
        }
        .view-all-link:hover {
          color: #1890ff;
          background: #e6f7ff;
        }

        .category-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 160px;
          padding: 16px;
          text-align: center;
          transition: all 0.3s;
          border-right: 1px solid #f0f0f0;
          border-bottom: 1px solid #f0f0f0;
          background: #fff;
        }

        .category-card:hover {
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          transform: translateY(-4px);
          z-index: 2;
        }

        .icon-box {
          width: 72px;
          height: 72px;
          margin-bottom: 12px;
          border-radius: 20px;
          background: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          transition: 0.3s;
        }

        .category-card:hover .icon-box {
          background: #e6f7ff;
          transform: scale(1.05);
        }

        .icon-box img {
          width: 80%;
          height: 80%;
          object-fit: contain;
        }

        /* FONT giống SaleProduct */
        .category-name {
          font-size: 16px;
          font-weight: 600;
          color: #262626;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .category-card:hover .category-name {
          color: #1890ff;
        }

        /* Fix border grid */
        @media (min-width: 1200px) {
          .category-card:nth-child(8n) {
            border-right: none;
          }
        }
      `,
        }}
      />
    </div>
  );
}

export default Category;
