// src/modules/export/export.controller.js
import exportService from './export.service.js';
import User from '../../database/mysql/user/user.model.js';
import UserAddress from '../../database/mysql/user/userAddress.model.js';
import Product from '../../database/mysql/catalog/product.model.js';
import Variant from '../../database/mysql/variant/variant.model.js';
import Category from '../../database/mysql/catalog/category.model.js';
import Brand from '../../database/mysql/catalog/brand.model.js';
import Order from '../../database/mysql/order/order.model.js';
import OrderItem from '../../database/mysql/order/orderItem.model.js';
import Payment from '../../database/mysql/payment/payment.model.js';
import Promotion from '../../database/mysql/promotion/promotion.model.js';
import Voucher from '../../database/mysql/voucher/voucher.model.js';
import Supplier from '../../database/mysql/inventory/supplier.model.js';
import Inventory from '../../database/mysql/inventory/inventory.model.js';

class ExportController {
  async export(req, res, next) {
    try {
      const { type, format } = req.query;
      let data = [];
      let columns = [];

      switch(type) {
        // Người dùng & khách hàng
        case 'users':
          const users = await User.findAll();
          data = users.map(u => ({
            id: u.id, name: u.name, email: u.email, phone: u.phone, role: u.role, status: u.status
          }));
          columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Name', key: 'name', width: 30 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'Phone', key: 'phone', width: 20 },
            { header: 'Role', key: 'role', width: 15 },
            { header: 'Status', key: 'status', width: 10 }
          ];
          break;

        case 'user_addresses':
          const addresses = await UserAddress.findAll();
          data = addresses.map(a => ({
            id: a.id,
            user_id: a.user_id,
            full_name: a.full_name,
            phone: a.phone,
            province: a.province,
            district: a.district,
            ward: a.ward,
            address_detail: a.address_detail,
            is_default: a.is_default
          }));
          columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'User ID', key: 'user_id', width: 10 },
            { header: 'Full Name', key: 'full_name', width: 20 },
            { header: 'Phone', key: 'phone', width: 15 },
            { header: 'Province', key: 'province', width: 15 },
            { header: 'District', key: 'district', width: 15 },
            { header: 'Ward', key: 'ward', width: 15 },
            { header: 'Address', key: 'address_detail', width: 30 },
            { header: 'Default', key: 'is_default', width: 10 },
          ];
          break;

        // Sản phẩm & kho
        case 'products':
          const products = await Product.findAll();
          data = products.map(p => ({
            id: p.id, name: p.name, slug: p.slug, category_id: p.category_id, brand_id: p.brand_id, status: p.status
          }));
          columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Name', key: 'name', width: 30 },
            { header: 'Slug', key: 'slug', width: 20 },
            { header: 'Category ID', key: 'category_id', width: 15 },
            { header: 'Brand ID', key: 'brand_id', width: 15 },
            { header: 'Status', key: 'status', width: 10 },
          ];
          break;

        case 'product_variants':
          const variants = await Variant.findAll();
          data = variants.map(v => ({
            id: v.id, product_id: v.product_id, sku: v.sku, price: v.price, stock: v.stock
          }));
          columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Product ID', key: 'product_id', width: 10 },
            { header: 'SKU', key: 'sku', width: 20 },
            { header: 'Price', key: 'price', width: 15 },
            { header: 'Stock', key: 'stock', width: 10 },
          ];
          break;

        case 'categories':
          const categories = await Category.findAll();
          data = categories.map(c => ({ id: c.id, name: c.name, slug: c.slug, status: c.status }));
          columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Name', key: 'name', width: 20 },
            { header: 'Slug', key: 'slug', width: 20 },
            { header: 'Status', key: 'status', width: 10 },
          ];
          break;

        case 'brands':
          const brands = await Brand.findAll();

          data = brands.map(b => ({
            id: b.id,
            name: b.name,
            slug: b.slug,
            logo: b.logo
          }));

          columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Logo', key: 'logo', width: 20 },
            { header: 'Name', key: 'name', width: 20 },
            { header: 'Slug', key: 'slug', width: 20 },
          ];
          break;

        // Đơn hàng & thanh toán
        case 'orders':
          const orders = await Order.findAll();
          data = orders.map(o => ({ id: o.id, user_id: o.user_id, total: o.total, status: o.status, created_at: o.created_at }));
          columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'User ID', key: 'user_id', width: 10 },
            { header: 'Total', key: 'total', width: 15 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'Created At', key: 'created_at', width: 20 },
          ];
          break;

        case 'order_items':
          const orderItems = await OrderItem.findAll();
          data = orderItems.map(i => ({ id: i.id, order_id: i.order_id, product_name: i.product_name, price: i.price, quantity: i.quantity }));
          columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Order ID', key: 'order_id', width: 10 },
            { header: 'Product', key: 'product_name', width: 20 },
            { header: 'Price', key: 'price', width: 15 },
            { header: 'Quantity', key: 'quantity', width: 10 },
          ];
          break;

        case 'payments':
          const payments = await Payment.findAll();
          data = payments.map(p => ({ id: p.id, order_id: p.order_id, method: p.method, status: p.status, amount: p.amount, paid_at: p.paid_at }));
          columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Order ID', key: 'order_id', width: 10 },
            { header: 'Method', key: 'method', width: 15 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'Amount', key: 'amount', width: 15 },
            { header: 'Paid At', key: 'paid_at', width: 20 },
          ];
          break;

        // Khuyến mãi & voucher
        case 'promotions':
          const promos = await Promotion.findAll();
          data = promos.map(p => ({ id: p.id, name: p.name, type: p.type, value: p.value, start_date: p.start_date, end_date: p.end_date, status: p.status }));
          columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Name', key: 'name', width: 20 },
            { header: 'Type', key: 'type', width: 10 },
            { header: 'Value', key: 'value', width: 10 },
            { header: 'Start Date', key: 'start_date', width: 20 },
            { header: 'End Date', key: 'end_date', width: 20 },
            { header: 'Status', key: 'status', width: 10 },
          ];
          break;

        case 'vouchers':
          const vouchers = await Voucher.findAll();
          data = vouchers.map(v => ({ id: v.id, code: v.code, name: v.name, type: v.type, discount_type: v.discount_type, discount_value: v.discount_value, status: v.status }));
          columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Code', key: 'code', width: 15 },
            { header: 'Name', key: 'name', width: 20 },
            { header: 'Type', key: 'type', width: 10 },
            { header: 'Discount Type', key: 'discount_type', width: 15 },
            { header: 'Discount Value', key: 'discount_value', width: 15 },
            { header: 'Status', key: 'status', width: 10 },
          ];
          break;

        // Kho & nhà cung cấp
        case 'suppliers':
          const suppliers = await Supplier.findAll();
          data = suppliers.map(s => ({ id: s.id, name: s.name, phone: s.phone, email: s.email, address: s.address, status: s.status }));
          columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Name', key: 'name', width: 20 },
            { header: 'Phone', key: 'phone', width: 15 },
            { header: 'Email', key: 'email', width: 25 },
            { header: 'Address', key: 'address', width: 30 },
            { header: 'Status', key: 'status', width: 10 },
          ];
          break;

        case 'inventories':
          const inventories = await Inventory.findAll();
          data = inventories.map(i => ({ id: i.id, variant_id: i.variant_id, supplier_id: i.supplier_id, quantity: i.quantity, cost_price: i.cost_price, import_date: i.import_date }));
          columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Variant ID', key: 'variant_id', width: 10 },
            { header: 'Supplier ID', key: 'supplier_id', width: 10 },
            { header: 'Quantity', key: 'quantity', width: 10 },
            { header: 'Cost Price', key: 'cost_price', width: 15 },
            { header: 'Import Date', key: 'import_date', width: 20 },
          ];
          break;

        default:
          return res.status(400).json({ message: 'Invalid export type' });
      }

      // Xuất file
      if(format === 'excel') {
        const buffer = await exportService.exportExcel(data, columns);
        res.setHeader('Content-Disposition', `attachment; filename=${type}.xlsx`);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        return res.send(buffer);
      } else if(format === 'pdf') {
        return exportService.exportPdf(data, columns, res);
      } else {
        return res.status(400).json({ message: 'Invalid format' });
      }

    } catch(error) {
      next(error);
    }
  }
}

export default new ExportController();
