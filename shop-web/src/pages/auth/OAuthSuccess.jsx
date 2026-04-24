import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function OAuthSuccess() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      // Kiểm tra nếu có refreshToken thì mới lưu để tránh lưu giá trị "null"
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
      
      // Chuyển hướng về trang chủ sau khi lưu token thành công
      navigate("/");
    } else {
      // Nếu không có token, chuyển hướng về trang login
      navigate("/login");
    }
  }, [navigate, params]); // Thêm các phụ thuộc vào đây để fix lỗi ESLint

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontSize: '1.2rem'
    }}>
      Đang xử lý đăng nhập...
    </div>
  );
}

export default OAuthSuccess;