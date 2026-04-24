import sequelize from "../../config/mysql.config.js";

/* =============================
   IMPORT MODELS
============================= */

// USER
import User from "./user/user.model.js";
import UserAddress from "./user/userAddress.model.js";
import UserOtp from "./user/userOtp.model.js";

// CATALOG
import Category from "./catalog/category.model.js";
import Brand from "./catalog/brand.model.js";
import Product from "./catalog/product.model.js";
import ProductImage from "./catalog/productImage.model.js";
import ProductSpecification from "./catalog/productSpecification.model.js";
import ProductAccessory from "./catalog/productAccessory.model.js";
import ProductBundle from "./catalog/productBundle.model.js";
import ProductBundleItem from "./catalog/productBundleItem.model.js";

// ATTRIBUTE + VARIANT
import Attribute from "./attribute/attribute.model.js";
import AttributeValue from "./attribute/attributeValue.model.js";
import Variant from "./variant/variant.model.js";
import VariantValue from "./variant/variantValue.model.js";

// PROMOTION
import Promotion from "./promotion/promotion.model.js";
import PromotionItem from "./promotion/promotionItem.model.js";

// REVIEW
import Review from "./review/review.model.js";
import ReviewImage from "./review/reviewImage.model.js";
import Wishlist from "./review/wishlist.model.js";

// CART
import Cart from "./cart/cart.model.js";
import CartItem from "./cart/cartItem.model.js";


// ORDER
import Order from "./order/order.model.js";
import OrderItem from "./order/orderItem.model.js";
import OrderStatusLog from "./order/orderStatusLog.model.js";
import OrderVoucher from "./order/orderVoucher.model.js";

// PAYMENT
import Payment from "./payment/payment.model.js";

// SHIPMENT
import Shipment from "./shipment/shipment.model.js";
import ShipmentProof from "./shipment/shipmentProof.model.js";
import ShipperLocation from "./shipment/ShipperLocation.model.js";

// VOUCHER
import Voucher from "./voucher/voucher.model.js";
import UserVoucher from "./voucher/userVoucher.model.js";
import VoucherApply from "./voucher/voucherApply.model.js";

// INVENTORY
import Supplier from "./inventory/supplier.model.js";
import Inventory from "./inventory/inventory.model.js";
import InventoryLog from "./inventory/inventoryLog.model.js";

// CONTRACT
import Contract from "./contract/contract.model.js";
import Warranty from "./contract/warranty.model.js";

// CMS
import Menu from "./cms/menu.model.js";
import Banner from "./cms/banner.model.js";
import Setting from "./cms/setting.model.js";
import Topic from "./cms/topic.model.js";
import Post from "./cms/post.model.js";
import PostImage from "./cms/postImage.model.js";
import PostProduct from "./cms/postProduct.model.js";

/* =============================
   ASSOCIATIONS
============================= */

/* ---------- USER ---------- */

User.hasMany(UserAddress, { foreignKey: "user_id" });
UserAddress.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(UserOtp, {
  foreignKey: "user_id",
  as: "otps",
});

UserOtp.belongsTo(User, {
  foreignKey: "user_id",
});

User.hasMany(Order, { foreignKey: "user_id" });
Order.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Review, { foreignKey: "user_id" });
Review.belongsTo(User, { foreignKey: "user_id" });

User.hasOne(Cart, { foreignKey: "user_id" });
Cart.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Shipment, { foreignKey: "shipper_id" });

User.hasMany(Post, {
  foreignKey: "author_id",
  as: "Posts",
});

User.hasMany(OrderStatusLog, {
  foreignKey: "changed_by",
});

/* ---------- CATEGORY ---------- */

Category.hasMany(Product, { foreignKey: "category_id" });
Product.belongsTo(Category, { foreignKey: "category_id" });

Category.hasMany(Category, {
  foreignKey: "parent_id",
  as: "children",
});

Category.belongsTo(Category, {
  foreignKey: "parent_id",
  as: "parent",
});

/* ---------- BRAND ---------- */

Brand.hasMany(Product, { foreignKey: "brand_id" });
Product.belongsTo(Brand, { foreignKey: "brand_id" });

/* ---------- PRODUCT ---------- */

Product.hasMany(ProductImage, { foreignKey: "product_id" });
ProductImage.belongsTo(Product, { foreignKey: "product_id" });

Product.hasMany(ProductSpecification, { foreignKey: "product_id" });
ProductSpecification.belongsTo(Product, { foreignKey: "product_id" });

Product.hasMany(Variant, { foreignKey: "product_id" });
Variant.belongsTo(Product, { foreignKey: "product_id" });

/* ---------- ACCESSORY ---------- */

Product.belongsToMany(Product, {
  through: ProductAccessory,
  as: "Accessories",
  foreignKey: "product_id",
  otherKey: "accessory_id",
});

Product.belongsToMany(Product, {
  through: ProductAccessory,
  as: "MainProducts",
  foreignKey: "accessory_id",
  otherKey: "product_id",
});

/* FIX EAGER LOADING */

ProductAccessory.belongsTo(Product, {
  foreignKey: "product_id",
  as: "product",
});

ProductAccessory.belongsTo(Product, {
  foreignKey: "accessory_id",
  as: "accessory",
});

/* ---------- PRODUCT BUNDLE ---------- */

ProductBundle.hasMany(ProductBundleItem, {
  foreignKey: "bundle_id",
  as: "bundleItems",
});

ProductBundleItem.belongsTo(ProductBundle, {
  foreignKey: "bundle_id",
  as: "bundle",
});

Variant.hasMany(ProductBundleItem, {
  foreignKey: "variant_id",
  as: "variantBundleItems",
});

ProductBundleItem.belongsTo(Variant, {
  foreignKey: "variant_id",
  as: "variant",
});

ProductBundle.belongsToMany(Variant, {
  through: ProductBundleItem,
  foreignKey: "bundle_id",
  otherKey: "variant_id",
  as: "variants",
});

Variant.belongsToMany(ProductBundle, {
  through: ProductBundleItem,
  foreignKey: "variant_id",
  otherKey: "bundle_id",
  as: "bundles",
});

/* ---------- ATTRIBUTE ---------- */

Attribute.hasMany(AttributeValue, {
  foreignKey: "attribute_id",
});

AttributeValue.belongsTo(Attribute, {
  foreignKey: "attribute_id",
});

Variant.belongsToMany(AttributeValue, {
  through: VariantValue,
  foreignKey: "variant_id",
});

AttributeValue.belongsToMany(Variant, {
  through: VariantValue,
  foreignKey: "attribute_value_id",
});
//Văn phúc chêm
VariantValue.belongsTo(AttributeValue, {
  foreignKey: "attribute_value_id",
});

VariantValue.belongsTo(Variant, {
  foreignKey: "variant_id",
});

/* ---------- PROMOTION ---------- */

Promotion.hasMany(PromotionItem, {
  foreignKey: "promotion_id",
});

PromotionItem.belongsTo(Promotion, {
  foreignKey: "promotion_id",
});

PromotionItem.belongsTo(Category, {
  foreignKey: "category_id",
});

PromotionItem.belongsTo(Product, {
  foreignKey: "product_id",
});

PromotionItem.belongsTo(Variant, {
  foreignKey: "variant_id",
});

PromotionItem.belongsTo(Brand, {
  foreignKey: "brand_id",
});

/* ---------- REVIEW ---------- */

Product.hasMany(Review, { foreignKey: "product_id" });
Review.belongsTo(Product, { foreignKey: "product_id" });

Review.hasMany(ReviewImage, { foreignKey: "review_id" });
ReviewImage.belongsTo(Review, { foreignKey: "review_id" });

Review.hasMany(Review, {
  foreignKey: "parent_id",
  as: "Replies",
});

Review.belongsTo(Review, {
  foreignKey: "parent_id",
  as: "Parent",
});

/* ---------- WISHLIST ---------- */

User.belongsToMany(Product, {
  through: Wishlist,
  foreignKey: "user_id",
});

Product.belongsToMany(User, {
  through: Wishlist,
  foreignKey: "product_id",
});
Wishlist.belongsTo(User, {
  foreignKey: "user_id"
});

Wishlist.belongsTo(Product, {
  foreignKey: "product_id"
});

User.hasMany(Wishlist, {
  foreignKey: "user_id"
});

Product.hasMany(Wishlist, {
  foreignKey: "product_id"
});

/* ---------- CART ---------- */

Cart.hasMany(CartItem, { foreignKey: "cart_id" });
CartItem.belongsTo(Cart, { foreignKey: "cart_id" });

Variant.hasMany(CartItem, { foreignKey: "variant_id" });
CartItem.belongsTo(Variant, { foreignKey: "variant_id" });


ProductBundle.hasMany(CartItem, {
  foreignKey: "bundle_id",
  as: "cartItems", // alias bên ProductBundle
});

CartItem.belongsTo(ProductBundle, {
  foreignKey: "bundle_id",
  as: "bundle", // alias phải trùng với include
});



/* ---------- ORDER ---------- */

Order.hasMany(OrderItem, { foreignKey: "order_id" });
OrderItem.belongsTo(Order, { foreignKey: "order_id" });

Variant.hasMany(OrderItem, { foreignKey: "variant_id" });
OrderItem.belongsTo(Variant, { foreignKey: "variant_id" });

ProductBundle.hasMany(OrderItem, {
  foreignKey: "bundle_id",
  as: "orderItems",
});

OrderItem.belongsTo(ProductBundle, {
  foreignKey: "bundle_id",
  as: "bundle",
});

Order.hasMany(OrderStatusLog, { foreignKey: "order_id" });
OrderStatusLog.belongsTo(Order, { foreignKey: "order_id" });

Order.belongsTo(UserAddress, { foreignKey: "address_id" });
UserAddress.hasMany(Order, { foreignKey: "address_id" });

Order.belongsToMany(Voucher, {
  through: OrderVoucher,
  foreignKey: "order_id",
});

Voucher.belongsToMany(Order, {
  through: OrderVoucher,
  foreignKey: "voucher_id",
});

OrderStatusLog.belongsTo(User, {
  foreignKey: "changed_by",
  as: "ChangedBy",
});

Order.hasMany(OrderVoucher, {
  foreignKey: "order_id",
});

Voucher.hasMany(OrderVoucher, {
  foreignKey: "voucher_id",
});

OrderVoucher.belongsTo(Order, {
  foreignKey: "order_id",
});

OrderVoucher.belongsTo(Voucher, {
  foreignKey: "voucher_id",
});

/* ---------- PAYMENT ---------- */

Order.hasMany(Payment, { foreignKey: "order_id" });
Payment.belongsTo(Order, { foreignKey: "order_id" });

/* ---------- SHIPMENT ---------- */

Order.hasOne(Shipment, { foreignKey: "order_id" });
Shipment.belongsTo(Order, { foreignKey: "order_id" });

Shipment.belongsTo(User, {
  foreignKey: "shipper_id",
  as: "Shipper",
});

Shipment.hasMany(ShipmentProof, {
  foreignKey: "shipment_id",
});

ShipmentProof.belongsTo(Shipment, {
  foreignKey: "shipment_id",
});
/* ---------- SHIPPER LOCATION ---------- */

Shipment.hasMany(ShipperLocation, {
  foreignKey: "shipment_id",
  as: "Locations",
});

ShipperLocation.belongsTo(Shipment, {
  foreignKey: "shipment_id",
});

User.hasMany(ShipperLocation, {
  foreignKey: "shipper_id",
});

ShipperLocation.belongsTo(User, {
  foreignKey: "shipper_id",
  as: "Shipper",
});


/* ---------- VOUCHER ---------- */

Voucher.belongsToMany(User, {
  through: UserVoucher,
  foreignKey: "voucher_id",
});

User.belongsToMany(Voucher, {
  through: UserVoucher,
  foreignKey: "user_id",
});

UserVoucher.belongsTo(User, {
  foreignKey: "user_id",
});

UserVoucher.belongsTo(Voucher, {
  foreignKey: "voucher_id",
});

Voucher.hasMany(VoucherApply, {
  foreignKey: "voucher_id",
});

VoucherApply.belongsTo(Voucher, {
  foreignKey: "voucher_id",
});

VoucherApply.belongsTo(Category, {
  foreignKey: "category_id",
});

VoucherApply.belongsTo(Product, {
  foreignKey: "product_id",
});

Category.hasMany(VoucherApply, {
  foreignKey: "category_id",
});

Product.hasMany(VoucherApply, {
  foreignKey: "product_id",
});

/* ---------- INVENTORY ---------- */

Variant.hasMany(Inventory, { foreignKey: "variant_id" });
Inventory.belongsTo(Variant, { foreignKey: "variant_id" });

Supplier.hasMany(Inventory, {
  foreignKey: "supplier_id",
});

Inventory.belongsTo(Supplier, {
  foreignKey: "supplier_id",
});

Variant.hasMany(InventoryLog, {
  foreignKey: "variant_id",
});

InventoryLog.belongsTo(Variant, {
  foreignKey: "variant_id",
});

/* ---------- CONTRACT ---------- */

Order.hasOne(Contract, { foreignKey: "order_id" });
Contract.belongsTo(Order, { foreignKey: "order_id" });

Variant.hasMany(Warranty, {
  foreignKey: "variant_id",
});

Warranty.belongsTo(Variant, {
  foreignKey: "variant_id",
});

/* ---------- CMS ---------- */

Menu.hasMany(Menu, {
  foreignKey: "parent_id",
  as: "children",
});

Menu.belongsTo(Menu, {
  foreignKey: "parent_id",
  as: "parent",
});

Topic.hasMany(Post, { foreignKey: "topic_id" });
Post.belongsTo(Topic, { foreignKey: "topic_id" });

Post.belongsTo(User, {
  foreignKey: "author_id",
  as: "Author",
});

Post.hasMany(PostImage, { foreignKey: "post_id" });
PostImage.belongsTo(Post, { foreignKey: "post_id" });

Post.belongsToMany(Product, {
  through: PostProduct,
  foreignKey: "post_id",
});

Product.belongsToMany(Post, {
  through: PostProduct,
  foreignKey: "product_id",
});

PostProduct.belongsTo(Post, {
  foreignKey: "post_id",
  as: "Post",
});

PostProduct.belongsTo(Product, {
  foreignKey: "product_id",
  as: "Product",
});

/* =============================
   EXPORT
============================= */

export {
  sequelize,
  User,
  UserAddress,
  Category,
  Brand,
  Product,
  ProductImage,
  ProductSpecification,
  ProductAccessory,
  ProductBundle,
  ProductBundleItem,
  Attribute,
  AttributeValue,
  Variant,
  VariantValue,
  Promotion,
  PromotionItem,
  Review,
  ReviewImage,
  Wishlist,
  Cart,
  CartItem,
  Order,
  OrderItem,
  OrderStatusLog,
  OrderVoucher,
  Payment,
  Shipment,
  ShipmentProof,
  Voucher,
  UserVoucher,
  VoucherApply,
  Supplier,
  Inventory,
  InventoryLog,
  Contract,
  Warranty,
  Menu,
  Banner,
  Setting,
  Topic,
  Post,
  PostImage,
  PostProduct,
  UserOtp,
  ShipperLocation,
};
