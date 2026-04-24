import React from "react";
import { Empty } from "antd";

function VoucherEmpty() {
  return (
    <Empty
      description="Bạn chưa có voucher nào"
      style={{ marginTop: 40 }}
    />
  );
}

export default VoucherEmpty;
