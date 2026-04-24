import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Layout, Input, Badge, Avatar, Dropdown, Space,
  Button, Typography, Tooltip, Spin
} from "antd";
import {
  ShoppingCartOutlined, MessageOutlined, LogoutOutlined,
  ProfileOutlined, SearchOutlined, ThunderboltOutlined,
  BellOutlined, QuestionCircleOutlined, FireOutlined,
  UserOutlined, AppstoreOutlined
} from "@ant-design/icons";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

// Context & Services
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastProvider";
import { useCart } from "../../context/CartContext";
import NotificationService from "../../services/notification.service";
import socket from "../../socket/socket";

const { Header } = Layout;
const { Text } = Typography;

const API_URL = "http://tbtshoplt.xyz";

function EcoShopeeHeader() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, logout } = useAuth();
  const notify = useToast();

  const { items: cartItems, bundles: cartBundles, loading: loadingCart, getFinalPrice } = useCart();

  /* ================= STATE ================= */
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNoti, setLoadingNoti] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("keyword") || "");

  /* ================= HELPERS ================= */
  const avatarUrl = useMemo(() => {
    if (!user?.avatar) return null;
    if (user.avatar.startsWith("http")) return user.avatar;
    const prefix = user.avatar.startsWith("/") ? "" : "/uploads/users/";
    return `${API_URL}${prefix}${user.avatar}`;
  }, [user?.avatar]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price || 0);
  };

  const getProductDisplay = (item) => {
    const product = item?.Product || item?.Variant?.Product;
    const img = item?.image || product?.thumbnail || item?.Variant?.image;
    const imgUrl = img ? (img.startsWith("http") ? img : `${API_URL}${img}`) : "https://via.placeholder.com/40";
    const name = product?.name || "Sản phẩm";
    const price = getFinalPrice(item);
    const variantStr = item?.Variant?.AttributeValues?.length > 0
      ? item.Variant.AttributeValues.map(a => a.value).join(" / ")
      : "";
    return { imgUrl, name, price, variantStr };
  };

  const totalCartCount = useMemo(() => {
    return (cartItems?.length || 0) + (cartBundles?.length || 0);
  }, [cartItems, cartBundles]);

  const combinedPreview = useMemo(() => {
    const normalizedItems = (cartItems || []).map(i => ({ ...i, isBundle: false }));
    const normalizedBundles = (cartBundles || []).map(b => ({ ...b, isBundle: true }));
    return [...normalizedBundles, ...normalizedItems].slice(0, 5);
  }, [cartItems, cartBundles]);

  /* ================= FETCH DATA ================= */
  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    setLoadingNoti(true);
    try {
      const res = await NotificationService.getNotifications();
      // Kiểm tra kỹ cấu trúc response từ backend của bạn
      const data = res?.data?.data || res?.data || res || [];
      const finalData = Array.isArray(data) ? data : [];
      setNotifications(finalData);
      setUnreadCount(finalData.filter(n => n && !n.is_read).length);
    } catch (error) {
      console.error("Fetch notifications error:", error);
    } finally {
      setLoadingNoti(false);
    }
  }, [user]);

  /* ================= EFFECTS ================= */
  useEffect(() => {
    setSearchTerm(searchParams.get("keyword") || "");
  }, [searchParams]);

  useEffect(() => {
    if (user) fetchNotifications();
    else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user, fetchNotifications]);

  useEffect(() => {
    if (!user || !socket) return;
    const userId = user._id || user.id;

    socket.emit("join_notification", userId);

    const handleReceiveNoti = (newNoti) => {
      setNotifications(prev => [newNoti, ...prev]);
      setUnreadCount(prev => prev + 1);
      notify.info(`🔔 ${newNoti.title}`);
    };

    const handleReadNoti = (updatedNoti) => {
      const targetId = updatedNoti._id || updatedNoti.id;
      setNotifications(prev => prev.map(n => (n._id === targetId || n.id === targetId) ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    };

    socket.on("receive_notification", handleReceiveNoti);
    socket.on("notification_read", handleReadNoti);

    return () => {
      socket.emit("leave_notification", userId);
      socket.off("receive_notification", handleReceiveNoti);
      socket.off("notification_read", handleReadNoti);
    };
  }, [user, notify]);

  /* ================= HANDLERS ================= */
  const handleSearch = () => {
    const term = searchTerm.trim();
    navigate(term ? `/search?keyword=${encodeURIComponent(term)}` : `/`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleLogout = () => {
    logout();
    notify.success("Hẹn gặp lại bạn!");
    navigate("/login");
  };

  const handleMarkAsRead = async (noti) => {
    // Ưu tiên lấy _id, nếu không có thì lấy id
    const notiId = noti._id || noti.id;

    if (!notiId) {
      console.error("Không tìm thấy ID của thông báo:", noti);
      navigate(`/notification`); 
      return;
    }

    if (!noti.is_read) {
      try {
        await NotificationService.markAsRead(notiId);
        // Cập nhật state local
        setNotifications(prev => 
          prev.map(n => (n._id === notiId || n.id === notiId) ? { ...n, is_read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (error) {
        console.error("Lỗi khi đánh dấu đã đọc:", error);
      }
    }
    navigate(`/notification`); 
  };

  /* ================= RENDER HELPERS ================= */

  const renderNotificationPanel = () => (
    <div className="eco-cart-panel noti-panel">
      <div className="eco-cart-header">
        <span>Thông báo mới</span>
        <Link to="/notification" className="view-all-link" style={{ color: '#00ff88', fontSize: '12px' }}>Xem tất cả</Link>
      </div>
      <Spin spinning={loadingNoti}>
        <div className="noti-list-scroll" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {notifications.length === 0 ? (
            <span style={{ color: 'rgba(255,255,255,0.4)', padding: '20px', display: 'block', textAlign: 'center' }}>Không có thông báo</span>
          ) : (
            notifications.map((item) => {
              const itemId = item._id || item.id; // Lấy ID an toàn
              return (
                <div 
                  key={itemId || Math.random()} 
                  className={`eco-cart-item ${!item.is_read ? "unread-item" : ""}`}
                  onClick={() => handleMarkAsRead(item)}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', padding: '12px 15px' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className="noti-title" style={{ 
                      color: item.is_read ? 'rgba(255,255,255,0.7)' : '#fff', 
                      fontWeight: item.is_read ? 'normal' : 'bold', 
                      marginBottom: '4px' 
                    }}>
                      {item.title}
                    </span>
                    <Text type="secondary" className="noti-content" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }} ellipsis>{item.content}</Text>
                    <span className="noti-time" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>
                      {item.created_at ? new Date(item.created_at).toLocaleString() : "Vừa xong"}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Spin>
    </div>
  );

  const renderCartPreview = () => (
    <div className="eco-cart-panel">
      <div className="eco-cart-header">
        <Space><FireOutlined /><span>Sản phẩm mới thêm</span></Space>
      </div>
      <Spin spinning={loadingCart}>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {combinedPreview.length === 0 ? (
            <span style={{ color: 'rgba(255,255,255,0.4)', padding: '20px', display: 'block', textAlign: 'center' }}>Giỏ hàng trống</span>
          ) : (
            combinedPreview.map((item, idx) => {
              if (item.isBundle) {
                return (
                  <div key={`bundle-${idx}`} className="eco-cart-item bundle-item-preview" style={{ display: 'flex', gap: '12px' }}>
                    <div className="eco-bundle-icon-wrap">
                      <AppstoreOutlined style={{ fontSize: '20px', color: '#00ff88' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className="eco-cart-name" style={{ color: '#fff' }}><Badge status="success" /> {item.name}</span>
                        <Text type="secondary" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>{item.comboItems?.length} sản phẩm</Text>
                      </div>
                      <div className="eco-cart-meta">
                        <span className="eco-cart-price" style={{ color: '#00ff88' }}>Combo Ưu Đãi</span>
                        <Text type="secondary" style={{ color: '#fff' }}>x{item.quantity}</Text>
                      </div>
                    </div>
                  </div>
                );
              }
              const info = getProductDisplay(item);
              return (
                <div key={`item-${idx}`} className="eco-cart-item" style={{ display: 'flex', gap: '12px' }}>
                  <img src={info.imgUrl} alt="thumb" className="eco-cart-thumb" />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span className="eco-cart-name" style={{ color: '#fff' }}>{info.name}</span>
                      {info.variantStr && <Text type="secondary" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>{info.variantStr}</Text>}
                    </div>
                    <div className="eco-cart-meta">
                      <span className="eco-cart-price" style={{ color: '#00ff88' }}>{formatPrice(info.price)}</span>
                      <Text type="secondary" style={{ color: '#fff' }}>x{item.quantity}</Text>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Spin>
      <div className="eco-cart-footer">
        <Text style={{ color: 'rgba(255,255,255,0.5)' }}>{totalCartCount} mục trong giỏ</Text>
        <Button type="primary" className="eco-btn-main" onClick={() => navigate("/cart")}>
          Xem Giỏ Hàng
        </Button>
      </div>
    </div>
  );

  const userMenuItems = [
    { key: "1", icon: <ProfileOutlined />, label: "Hồ sơ của tôi", onClick: () => navigate("/profile") },
    { key: "2", icon: <AppstoreOutlined />, label: "Danh sách yêu thích", onClick: () => navigate("/wishlist") },
    { type: "divider" },
    { key: "logout", icon: <LogoutOutlined />, label: "Đăng xuất", danger: true, onClick: handleLogout },
  ];

  return (
    <Header className="eco-header-wrapper">
      <div className="eco-top-bar">
        <div className="eco-container">
          <Text className="top-welcome">Chào mừng đến với BTech</Text>
          <Space size={20}>
            <Dropdown 
              popupRender={renderNotificationPanel} 
              placement="bottomRight" 
              arrow 
              trigger={["click"]}
            >
              <span className="eco-top-link">
                <Badge count={unreadCount} size="small" offset={[10, 0]}>
                  <BellOutlined className={unreadCount > 0 ? "bell-animation" : ""} style={{ color: unreadCount > 0 ? "#00ff88" : "inherit" }} />
                </Badge> Thông báo
              </span>
            </Dropdown>

            <span className="eco-top-link"><QuestionCircleOutlined /> Hỗ trợ</span>
            
            {user ? (
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <span className="eco-user-trigger">
                  <Avatar size={22} src={avatarUrl} icon={!avatarUrl && <UserOutlined />} className="eco-avatar">
                    {!avatarUrl && user?.name?.charAt(0).toUpperCase()}
                  </Avatar>
                  <span className="eco-username">{user.name}</span>
                </span>
              </Dropdown>
            ) : (
              <Space className="eco-auth-links">
                <Link to="/register">Đăng Ký</Link>
                <div className="divider-v" />
                <Link to="/login">Đăng Nhập</Link>
              </Space>
            )}
          </Space>
        </div>
      </div>

      <div className="eco-main-header">
        <div className="eco-container eco-flex-main">
          <Link to="/" className="eco-logo">
            <div className="eco-logo-box"><ThunderboltOutlined /></div>
            <span className="eco-logo-text">BTECH<span className="light">STORE</span></span>
          </Link>

          <div className="eco-search-section">
            <div className="eco-search-box">
              <Input
                placeholder="Săn Deal độc quyền..."
                className="eco-input-inner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                suffix={
                  <Button
                    type="primary"
                    className="eco-search-btn"
                    icon={<SearchOutlined />}
                    onClick={handleSearch}
                  />
                }
              />
            </div>
            <div className="eco-tags">
              {["Keyboard", "EcoSmart", "Gaming"].map(tag => (
                <span key={tag} style={{ cursor: 'pointer' }} onClick={() => { setSearchTerm(tag); navigate(`/search?keyword=${tag}`) }}>#{tag}</span>
              ))}
            </div>
          </div>

          <div className="eco-actions">
            <Tooltip title="Tin nhắn">
              <Badge dot color="#00ff88">
                <Button type="text" icon={<MessageOutlined />} className="eco-icon-btn" onClick={() => navigate("/chat")} />
              </Badge>
            </Tooltip>
            
            <Dropdown popupRender={renderCartPreview} placement="bottomRight" arrow>
              <div style={{ cursor: 'pointer' }}>
                <Badge count={totalCartCount} color="#00ff88" offset={[-2, 10]}>
                  <ShoppingCartOutlined className="eco-cart-icon" onClick={() => navigate("/cart")} />
                </Badge>
              </div>
            </Dropdown>
          </div>
        </div>
      </div>

      <style>{`
        .eco-header-wrapper { background: #013220; height: auto !important; padding: 0 !important; position: sticky; top: 0; z-index: 1000; box-shadow: 0 4px 20px rgba(0,0,0,0.4); }
        .eco-container { max-width: 1200px; width: 100%; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
        .eco-top-bar { height: 34px; background: rgba(0, 0, 0, 0.2); font-size: 12px; display: flex; align-items: center; }
        .top-welcome { color: rgba(255,255,255,0.5); }
        .eco-top-link { color: rgba(255,255,255,0.6) !important; cursor: pointer; transition: 0.3s; display: flex; align-items: center; gap: 4px; }
        .eco-top-link:hover { color: #00ff88 !important; }
        .eco-auth-links a { color: #fff !important; font-weight: 600; }
        .divider-v { width: 1px; height: 12px; background: rgba(255,255,255,0.2); }
        .eco-user-trigger { display: flex; align-items: center; gap: 8px; cursor: pointer; color: #fff; }
        .eco-avatar { border: 1.5px solid #00ff88; background: #01442b; }
        .eco-main-header { padding: 15px 0 10px 0; background: linear-gradient(180deg, #013220 0%, #01442b 100%); }
        .eco-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .eco-logo-box { width: 40px; height: 40px; background: linear-gradient(135deg, #00ff88, #00bd65); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 22px; color: #013220; box-shadow: 0 0 15px rgba(0, 255, 136, 0.4); }
        .eco-logo-text { font-size: 24px; font-weight: 800; color: #fff; }
        .eco-logo-text .light { color: #00ff88; }
        .eco-search-section { flex: 1; margin: 0 50px; }
        .eco-search-box { background: rgba(255, 255, 255, 0.08); padding: 3px; border-radius: 4px; border: 1px solid rgba(255, 255, 255, 0.1); }
        .eco-input-inner { background: transparent !important; border: none !important; color: #fff !important; }
        .eco-search-btn { background: #00ff88 !important; color: #013220 !important; border: none !important; }
        .eco-tags { margin-top: 5px; display: flex; gap: 15px; font-size: 11px; color: rgba(255,255,255,0.3); }
        .eco-actions { display: flex; align-items: center; gap: 20px; }
        .eco-icon-btn { color: #fff !important; font-size: 20px !important; }
        .eco-cart-icon { font-size: 26px; color: #fff; cursor: pointer; transition: 0.2s; }
        .eco-cart-icon:hover { color: #00ff88; transform: scale(1.1); }
        .eco-cart-panel { background: #01442b; width: 340px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 10px 30px rgba(0,0,0,0.5); overflow: hidden; }
        .eco-cart-header { padding: 10px 15px; color: #00ff88; background: rgba(0,0,0,0.2); display: flex; justify-content: space-between; font-weight: 600; }
        .eco-cart-item { padding: 12px 15px !important; border-bottom: 1px solid rgba(255,255,255,0.05) !important; cursor: pointer; }
        .eco-cart-item:hover { background: rgba(255,255,255,0.05); }
        .unread-item { background: rgba(0, 255, 136, 0.05); }
        .eco-bundle-icon-wrap { width: 45px; height: 45px; border-radius: 4px; background: rgba(0, 255, 136, 0.1); display: flex; align-items: center; justify-content: center; border: 1px dashed #00ff88; }
        .eco-cart-thumb { width: 45px; height: 45px; border-radius: 4px; object-fit: cover; background: #eee; }
        .eco-cart-meta { display: flex; justify-content: space-between; align-items: center; margin-top: 4px; }
        .eco-cart-price { color: #00ff88; font-weight: bold; font-size: 13px; }
        .eco-cart-footer { padding: 12px 15px; background: rgba(0,0,0,0.1); display: flex; justify-content: space-between; align-items: center; }
        .eco-btn-main { background: #00ff88 !important; color: #013220 !important; border: none; font-weight: bold; }
        .bell-animation { animation: bell-ring 2s infinite; }
        @keyframes bell-ring {
          0%, 100% { transform: rotate(0); }
          10%, 30% { transform: rotate(15deg); }
          20%, 40% { transform: rotate(-15deg); }
          50% { transform: rotate(0); }
        }
      `}</style>
    </Header>
  );
}

export default EcoShopeeHeader;