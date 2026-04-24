import React from "react";
import { Modal, Descriptions, Tag } from "antd";
import dayjs from "dayjs";

function VoucherDetailModal({ open, voucher, onClose }) {

  if (!voucher) return null;

  return (
    <Modal
      title="Chi tiết voucher"
      open={open}
      onCancel={onClose}
      footer={null}
    >

      <Descriptions column={1} bordered>

        <Descriptions.Item label="Tên voucher">
          {voucher.name}
        </Descriptions.Item>

        <Descriptions.Item label="Mã voucher">
          <Tag color="blue">{voucher.code}</Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Giảm giá">
          {voucher.discount_value}
        </Descriptions.Item>

        <Descriptions.Item label="Giảm tối đa">
          {voucher.max_discount}
        </Descriptions.Item>

        <Descriptions.Item label="Đơn tối thiểu">
          {voucher.min_order_value}
        </Descriptions.Item>

        <Descriptions.Item label="Ngày bắt đầu">
          {dayjs(voucher.start_date).format("DD/MM/YYYY")}
        </Descriptions.Item>

        <Descriptions.Item label="Ngày hết hạn">
          {dayjs(voucher.end_date).format("DD/MM/YYYY")}
        </Descriptions.Item>

        <Descriptions.Item label="Phạm vi áp dụng">
          {voucher.applies?.length ? voucher.applies.length + " cấu hình áp dụng" : "Tất cả sản phẩm"}
        </Descriptions.Item>

      </Descriptions>

    </Modal>
  );
}

export default VoucherDetailModal;
