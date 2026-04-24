import express from "express";
import authRoute from "../modules/auth/auth.route.js";
import userRoute from "../modules/users/user.route.js";
import addressRoute from "../modules/addresses/address.route.js";
import brandRoute from "../modules/brands/brand.route.js";
import categoryRoute from "../modules/categories/category.route.js";
import productRoute from "../modules/products/product.route.js";
import productImageRoute from "../modules/productImage/productImage.route.js";
import productAccessoryRoute from "../modules/productAccessories/productAccessory.route.js";
import productSpecificationRoute from "../modules/productSpecification/productSpecification.route.js";
import productBundleRoute from "../modules/bundles/bundle.route.js";
import productBundleItemRoute from "../modules/bundleItems/bundleItem.route.js";
import variantRoutes from "../modules/variants/variant.route.js";
import variantValueRoute from "../modules/variantValues/variantValue.route.js";
import attributeRoute from "../modules/attributes/attribute.route.js";
import attributeValueRoute from "../modules/attributeValue/attributeValue.route.js";
import bannerRoute from "../modules/banners/banner.route.js";
import menuRoute from "../modules/menus/menu.route.js";
import settingRoute from "../modules/settings/setting.route.js";
import topicRoute from "../modules/topics/topic.route.js";
import postRoute from "../modules/posts/post.route.js";
import postImageRoute from "../modules/postImages/postImage.route.js";
import postProductRoute from "../modules/postProducts/postProduct.route.js";
import promotionRoute from "../modules/promotions/promotion.route.js";
import promotionItemRoute from "../modules/promotionItems/promotionItem.route.js";
import voucherRoute from "../modules/vouchers/voucher.route.js";
import userVoucherRoute from "../modules/userVouchers/userVoucher.route.js";
import voucherApplyRoute from "../modules/voucherApplys/voucherApply.route.js";
import reviewRoute from "../modules/reviews/review.route.js";
import reviewImageRoute from "../modules/reviewImages/reviewImage.route.js";
import wishlistRoute from "../modules/wishlists/wishlist.route.js";
import shipmentRoute from "../modules/shipments/shipment.route.js";
import shipmentProofRoute from "../modules/shipmentProofs/shipmentProof.route.js";
import shipperLocationRoute from "../modules/shipperLocations/shipperLocation.route.js";

import contractRoute from "../modules/contracts/contract.route.js";
import warrantyRoute from "../modules/warrantys/warranty.route.js";
import supplierRoute from "../modules/supplier/supplier.route.js";
import inventoryRoute from "../modules/inventorys/inventory.route.js";
import inventoryLogRoute from "../modules/inventoryLogs/inventoryLog.route.js";
import cartRoute from "../modules/carts/cart.route.js";
import cartItemRoute from "../modules/cartItems/cartItem.route.js";
import orderRoute from "../modules/orders/order.route.js";
import orderItemRoute from "../modules/orderItems/orderItem.route.js";
import orderStatusLogRoute from "../modules/orderStatusLogs/orderStatusLog.route.js";
import orderVoucherRoute from "../modules/orderVouchers/orderVoucher.route.js";
import paymentRoute from "../modules/payments/payment.route.js";
import chatRoute from "../modules/chats/chat.route.js";
import messageRoute from "../modules/messages/message.route.js";
import attachmentRoute from "../modules/attachments/attachment.route.js";
import notificationRoute from "../modules/notifications/notification.route.js";

import exportRoute from '../modules/export/export.route.js';
import aiChatRoute from "../modules/ai-chat/aiChat.route.js";





const router = express.Router();

router.use("/auth", authRoute);
router.use("/users", userRoute);
router.use("/addresses", addressRoute);
router.use("/brands", brandRoute);
router.use("/categories", categoryRoute);
router.use("/products", productRoute);
router.use("/product-images", productImageRoute);
router.use("/product-accessories", productAccessoryRoute);
router.use("/product-specifications", productSpecificationRoute);
router.use("/product-bundles", productBundleRoute);
router.use("/product-bundle-items", productBundleItemRoute);
router.use("/variants", variantRoutes);
router.use("/variant-values", variantValueRoute);
router.use("/attributes", attributeRoute);
router.use("/attribute-values", attributeValueRoute);
router.use("/promotions", promotionRoute);
router.use("/promotion-items", promotionItemRoute);
router.use("/vouchers", voucherRoute);
router.use("/user-vouchers", userVoucherRoute);
router.use("/voucher-applies", voucherApplyRoute);
router.use("/reviews", reviewRoute);
router.use("/review-images", reviewImageRoute);
router.use("/wishlists", wishlistRoute);
router.use("/shipments", shipmentRoute);
router.use("/shipment-proofs", shipmentProofRoute);
router.use("/shipper-locations", shipperLocationRoute);

router.use("/contracts", contractRoute);
router.use("/warranties", warrantyRoute);
router.use("/suppliers", supplierRoute);
router.use("/inventories", inventoryRoute);
router.use("/inventory-logs", inventoryLogRoute);
router.use("/carts", cartRoute);
router.use("/cart-items", cartItemRoute);
router.use("/orders", orderRoute);
router.use("/order-items", orderItemRoute);
router.use("/order-status-logs", orderStatusLogRoute);
router.use("/order-vouchers", orderVoucherRoute);
router.use("/payments", paymentRoute);
router.use("/chats", chatRoute);
router.use("/messages", messageRoute);
router.use("/attachments", attachmentRoute);
router.use("/notifications", notificationRoute);
router.use("/banners", bannerRoute);
router.use("/menus", menuRoute);
router.use("/settings", settingRoute);
router.use("/topics", topicRoute);
router.use("/posts", postRoute);
router.use("/post-images", postImageRoute);
router.use("/post-products", postProductRoute);
router.use('/export', exportRoute);
router.use("/ai", aiChatRoute);



export default router;