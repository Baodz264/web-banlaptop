import { lazy } from "react";

// Layout
const ClientLayout = lazy(() => import("../layouts/ClientLayout"));

// Pages
const Home = lazy(() => import("../pages/client/home/home"));
const ChatClient = lazy(() => import("../pages/client/chat/ChatPage"));

const ProductList = lazy(() => import("../pages/client/product/ProductList"));
const ProductDetail = lazy(() => import("../pages/client/product/ProductDetail"));

const OAuthSuccess = lazy(() => import("../pages/auth/OAuthSuccess"));

const CartPage = lazy(() => import("../pages/client/cart/CartPage"));

const News = lazy(() => import("../pages/client/post/News"));
const PostDetail = lazy(() => import("../pages/client/post/PostDetail"));

const VoucherWallet = lazy(() => import("../pages/client/voucher/VoucherWallet"));

const Checkout = lazy(() => import("../pages/client/checkout/Checkout"));

const NotificationsPage = lazy(() =>
  import("../pages/client/notification/Notification")
);

const WishlistPage = lazy(() => import("../pages/client/wishlist/WishlistPage"));

const ProfilePage = lazy(() => import("../pages/client/profile/ProfilePage"));

const SearchPage = lazy(() => import("../pages/client/search/SearchPage"));

const BundlePage = lazy(() => import("../pages/client/combo/BundlePage"));

const PaymentSuccess = lazy(() =>
  import("../pages/client/payment/PaymentSuccess")
);

const PaymentFailed = lazy(() =>
  import("../pages/client/payment/PaymentFailed")
);

const IntroDuce = lazy(() =>
  import("../pages/client/introduce/HomeClient")
);

const ShipmentTracking = lazy(() =>
  import("../pages/client/shipment/ShipmentTracking")
);

const ClientRoutes = [
  {
    path: "/",
    element: <ClientLayout />,
    children: [
      { path: "/", element: <Home /> },

      { path: "/chat", element: <ChatClient /> },

      { path: "/product", element: <ProductList /> },
      { path: "/product/:slug", element: <ProductDetail /> },
      { path: "/products/category/:slug", element: <ProductList /> },

      { path: "/oauth-success", element: <OAuthSuccess /> },

      { path: "/cart", element: <CartPage /> },

      { path: "/news", element: <News /> },

      { path: "/post/:slug", element: <PostDetail /> },

      { path: "/voucher", element: <VoucherWallet /> },

      { path: "/checkout", element: <Checkout /> },

      { path: "/notification", element: <NotificationsPage /> },

      { path: "/wishlist", element: <WishlistPage /> },

      { path: "/profile", element: <ProfilePage /> },

      { path: "/search", element: <SearchPage /> },

      { path: "/combo", element: <BundlePage /> },

      { path: "/payment-success", element: <PaymentSuccess /> },

      { path: "/payment-failed", element: <PaymentFailed /> },

      { path: "/introduce", element: <IntroDuce /> },

      { path: "/shipment/:id", element: <ShipmentTracking /> },

    ],
  },
];

export default ClientRoutes;
