import React, { useEffect, useState } from "react";
import { Typography, Row, Col, Divider, Spin } from "antd";
import dayjs from "dayjs";

import VoucherCard from "../../../components/client/voucher/VoucherCard";
import VoucherDetailModal from "../../../components/client/voucher/VoucherDetailModal";
import VoucherEmpty from "../../../components/client/voucher/VoucherEmpty";

import VoucherService from "../../../services/voucher.service";
import VoucherApplyService from "../../../services/voucherApply.service";
import UserVoucherService from "../../../services/userVoucher.service";

import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastProvider";

const { Title, Text } = Typography;

function VoucherWallet() {
  const { user, loading: authLoading } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [vouchers, setVouchers] = useState([]);

  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    if (!authLoading) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [voucherRes, applyRes] = await Promise.all([
        VoucherService.getVouchers({ limit: 1000 }),
        VoucherApplyService.getVoucherApplies({ limit: 1000 }),
      ]);

      const vouchersData = voucherRes?.data?.data?.items || [];
      const applies = applyRes?.data?.data?.items || [];

      let ownedVoucherIds = [];
      if (user) {
        const userVoucherRes = await UserVoucherService.getUserVouchers({
          user_id: user.id,
          limit: 1000,
        });
        const userVouchers = userVoucherRes?.data?.data?.items || [];
        ownedVoucherIds = userVouchers.map((uv) => uv.voucher_id);
      }

      /* ================= FILTER & MERGE ================= */

      const availableVouchers = vouchersData
        .filter((voucher) => {
          // A. Ẩn voucher nếu người dùng ĐÃ NHẬN
          const isAlreadyOwned = ownedVoucherIds.includes(voucher.id);

          // B. Ẩn voucher nếu đã HẾT HẠN
          const isExpired = dayjs(voucher.end_date).isBefore(dayjs());

          return !isAlreadyOwned && !isExpired;
        })
        .map((voucher) => {
          const apply = applies.filter((a) => a.voucher_id === voucher.id);
          return {
            ...voucher,
            applies: apply,
            status: "active",
          };
        });

      setVouchers(availableVouchers);
    } catch (error) {
      console.error("Voucher store load error:", error);
      toast.error("Không thể tải danh sách kho voucher");
    } finally {
      setLoading(false);
    }
  };

  /* ================= RECEIVE VOUCHER (NHẬN MÃ) ================= */

  const receiveVoucher = async (voucher) => {
    if (!user) {
      toast.warning("Vui lòng đăng nhập để thu thập voucher!");
      return;
    }

    try {
      await UserVoucherService.createUserVoucher({
        user_id: user.id,
        voucher_id: voucher.id,
      });

      toast.success("Đã lưu mã giảm giá vào kho của bạn!");
      fetchData();
    } catch (error) {
      console.error("Receive voucher error:", error.response?.data);
      toast.error(error.response?.data?.message || "Không thể nhận voucher");
    }
  };

  /* ================= MODAL ================= */

  const openDetail = (voucher) => {
    setSelectedVoucher(voucher);
    setOpenModal(true);
  };

  /* ================= RENDER ================= */

  return (
    <div style={{ padding: "40px 20px", maxWidth: 1200, margin: "auto" }}>
      {/* HEADER SECTION */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <Title level={1} style={{ marginBottom: 8, fontSize: "32px" }}>
          ✨ Kho Voucher Hệ Thống
        </Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          Chọn những mã giảm giá tốt nhất trước khi chúng hết lượt!
        </Text>
      </div>

      {/* FIX 1: Dùng titlePlacement thay cho orientation */}
      <Divider titlePlacement="left">Mã giảm giá đang diễn ra</Divider>

      {/* LIST SECTION */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "100px 0" }}>
          {/* FIX 2: Dùng description thay cho tip */}
          <Spin size="large" description="Đang tìm kiếm ưu đãi..." />
        </div>
      ) : vouchers.length === 0 ? (
        <div style={{ padding: "40px 0" }}>
          <VoucherEmpty description="Bạn đã nhận hết tất cả các mã ưu đãi hiện có hoặc kho đang trống." />
        </div>
      ) : (
        <Row gutter={[24, 24]}>
          {vouchers.map((voucher) => (
            <Col xs={24} sm={24} md={12} lg={8} key={voucher.id}>
              <VoucherCard
                voucher={voucher}
                isOwned={false}
                onDetail={() => openDetail(voucher)}
                onReceive={() => receiveVoucher(voucher)}
              />
            </Col>
          ))}
        </Row>
      )}

      {/* MODAL CHI TIẾT */}
      <VoucherDetailModal
        open={openModal}
        voucher={selectedVoucher}
        onClose={() => setOpenModal(false)}
      />
    </div>
  );
}

export default VoucherWallet;