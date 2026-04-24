import PaymentService from "./payment.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import response from "../../utils/response.js";

class PaymentController {

  // GET LIST PAYMENT
  getPayments = asyncHandler(async (req, res) => {
    const payments = await PaymentService.getPayments(req.query);
    return response.success(res, payments);
  });

  // GET PAYMENT BY ID
  getPaymentById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const payment = await PaymentService.getPaymentById(id);

    return response.success(res, payment);
  });

  // CREATE PAYMENT (manual / COD)
  createPayment = asyncHandler(async (req, res) => {
    const payment = await PaymentService.createPayment(req.body);
    return response.success(res, payment, "Payment created");
  });

  // UPDATE PAYMENT
  updatePayment = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const payment = await PaymentService.updatePayment(id, req.body);

    return response.success(res, payment, "Payment updated");
  });

  // DELETE PAYMENT
  deletePayment = asyncHandler(async (req, res) => {
    const { id } = req.params;

    await PaymentService.deletePayment(id);

    return response.success(res, null, "Payment deleted");
  });

  // CREATE VNPAY PAYMENT
  createVNPayPayment = asyncHandler(async (req, res) => {
    const { order_id } = req.body;

    if (!order_id) {
      throw new Error("order_id is required");
    }

    let ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket?.remoteAddress ||
      req.ip;

    if (ipAddr === "::1") {
      ipAddr = "127.0.0.1";
    }

    const paymentUrl = await PaymentService.createVNPayPayment(
      order_id,
      ipAddr,
    );

    return response.success(res, { paymentUrl });
  });

  // VNPAY RETURN
  vnpayReturn = asyncHandler(async (req, res) => {
    const result = await PaymentService.handleVNPayReturn(req.query);

    if (result.success) {
      return res.redirect(
        `${frontendUrl}/payment-success?order_id=${result.orderId}`
      );
    }

    return res.redirect("${frontendUrl}/payment-failed");
  });
}

export default new PaymentController();
