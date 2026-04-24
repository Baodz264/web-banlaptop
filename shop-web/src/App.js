import { BrowserRouter, Routes, Route } from "react-router-dom";
import { App as AntdApp } from "antd";
import { Suspense, lazy } from "react";

import "./App.css";

import AdminRoutes from "./routes/AdminRoutes";
import AuthRoutes from "./routes/AuthRoutes";
import ClientRoutes from "./routes/ClientRoutes";

import ToastProvider from "./context/ToastProvider";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

const Forbidden = lazy(() => import("./pages/errors/Forbidden"));

// ================= RENDER ROUTES =================
function renderRoutes(routes) {
  return routes.map((route, index) => {
    if (route.children) {
      return (
        <Route key={index} path={route.path} element={route.element}>
          {renderRoutes(route.children)}
        </Route>
      );
    }
    return <Route key={index} path={route.path} element={route.element} />;
  });
}

// ================= APP =================
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <AntdApp>
            <BrowserRouter>

              <Suspense fallback={<div>Loading...</div>}>
                <Routes>

                  {/* ✅ ROUTES CHÍNH */}
                  {renderRoutes([
                    ...AuthRoutes,
                    ...ClientRoutes,
                    ...AdminRoutes,
                  ])}

                  {/* ✅ THÊM 403 Ở ĐÂY */}
                  <Route path="/403" element={<Forbidden />} />

                  {/* ✅ (OPTIONAL) fallback */}
                  <Route path="*" element={<div>404 Not Found</div>} />

                </Routes>
              </Suspense>

            </BrowserRouter>
          </AntdApp>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
