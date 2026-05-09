import { getDashboardData } from "./admin.query.service.js";

export const buildAnalytics = async () => {
  const data = await getDashboardData();

  const s = data.summary || {};
  const last = data.meta?.last_week || {};

  const revenue = Number(s.revenue || 0);
  const orders = Number(s.total_orders || 0);
  const users = Number(s.new_users || 0);

  const avgOrderValue = orders ? revenue / orders : 0;

  // ================= REAL TREND =================
  const revenueChange =
    last.revenue && last.revenue !== 0
      ? ((revenue - last.revenue) / last.revenue) * 100
      : 0;

  const orderChange =
    last.orders && last.orders !== 0
      ? ((orders - last.orders) / last.orders) * 100
      : 0;

  const userChange =
    last.users && last.users !== 0
      ? ((users - last.users) / last.users) * 100
      : 0;

  const trend = {
    avgOrderValue: Number(avgOrderValue.toFixed(2)),
    revenuePerOrder: Number(avgOrderValue.toFixed(2)),
    userPerOrder: orders ? Number((users / orders).toFixed(2)) : 0,

    revenueChange: Number(revenueChange.toFixed(2)),
    orderChange: Number(orderChange.toFixed(2)),
    userChange: Number(userChange.toFixed(2)),
  };

  // ================= ADVANCED =================
  const conversionRate = users ? orders / users : 0;

  const advanced = {
    conversionRate: Number(conversionRate.toFixed(4)),
    avgOrderValue: Number(avgOrderValue.toFixed(2)),
  };

  // ================= PROBLEM =================
  const problem = [];

  if (orders < 10) problem.push("⚠️ Traffic cực thấp");
  if (revenue < 50000000) problem.push("⚠️ Doanh thu yếu");
  if (users < 5) problem.push("⚠️ User acquisition yếu");
  if (conversionRate < 0.05) problem.push("⚠️ Tỷ lệ chuyển đổi thấp");

  // ================= STRATEGY =================
  const strategy = [];

  if (revenue < 80000000) {
    strategy.push("🔥 Flash Sale + Ads ngay");
  }

  if (orders < 20) {
    strategy.push("🚀 Tăng traffic (SEO + Ads)");
  }

  if (users < 10) {
    strategy.push("👥 Referral + voucher signup");
  }

  if (avgOrderValue < 200000) {
    strategy.push("🛒 Upsell + bundle sản phẩm");
  }

  // ================= SUMMARY =================
  const summary = {
    revenue,
    orders,
    users,
    health:
      revenue > 200000000
        ? "🟢 HEALTHY"
        : revenue > 80000000
        ? "🟡 WARNING"
        : "🔴 CRITICAL",
  };

  // ================= CHART =================
  const chart = data.chart || {
    revenue: [],
    orders: [],
    users: [],
  };

  // ================= TOP PRODUCTS INSIGHTS =================
  const topSelling = data.top_selling_products || [];
  const topRated = data.top_rated_products || [];
  const topWishlist = data.top_wishlist_products || [];

  // ===== POPULARITY SCORE =====
  const popularity = topSelling.map((p) => {
    const sold = Number(p.total_sold || 0);
    const rating = Number(p.average_rating || 0);
    const wishlist = Number(p.total_wishlist || 0);

    const score = sold * 3 + wishlist * 2 + rating * 10;

    return {
      product: p.product,
      sold,
      rating,
      wishlist,
      score: Number(score.toFixed(2)),
    };
  });

  popularity.sort((a, b) => b.score - a.score);

  // ===== TREND (giả lập logic nếu có data) =====
  const productInsights = {
    most_popular: popularity.slice(0, 5),
    top_rated: topRated.slice(0, 5),
    most_wishlisted: topWishlist.slice(0, 5),
  };

  // ================= RETURN =================
  return {
    summary,
    trend,
    problem,
    strategy,
    advanced,
    chart,
    meta: data.meta || {},

    // ================= NEW INSIGHTS =================
    productInsights,
  };
};