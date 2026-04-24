import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import CartService from "../services/cart.service";
import CartItemService from "../services/cartItem.service";
import promotionService from "../services/promotion.service";
import promotionItemService from "../services/promotionItem.service";
import UserVoucherService from "../services/userVoucher.service";
import VoucherService from "../services/voucher.service";
import productAccessoryService from "../services/productAccessory.service";

const CartContext = createContext();

// ===================== HELPER =====================
const isMatch = (product, promoItem) => {
  if (!product || !promoItem) return false;
  if (promoItem.apply_type === "all") return true;

  const pId = String(product.id || product.product_id || "");
  const brandId = String(product.brand_id || product.Brand?.id || "");
  const categoryId = String(product.category_id || product.Category?.id || "");

  if (promoItem.apply_type === "product") return pId === String(promoItem.product_id);
  if (promoItem.apply_type === "brand") return brandId === String(promoItem.brand_id);
  if (promoItem.apply_type === "category") return categoryId === String(promoItem.category_id);

  return false;
};

// ===================== PROVIDER =====================
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [items, setItems] = useState([]);
  const [bundles, setBundles] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [allPromotions, setAllPromotions] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [userVouchers, setUserVouchers] = useState([]);
  const [systemVouchers, setSystemVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token] = useState(localStorage.getItem("accessToken"));

  // ===================== RESET STATE =====================
  const resetStates = useCallback(() => {
    setCart(null);
    setItems([]);
    setBundles([]);
    setSelectedItems([]);
    setAllPromotions([]);
    setPromotions([]);
    setUserVouchers([]);
    setSystemVouchers([]);
    setSelectedVoucher(null);
  }, []);

  // ===================== FETCH CART =====================
  const fetchCartData = useCallback(async () => {
    if (!token) {
      resetStates();
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [promoRes, promoItemsRes, uvRes, vRes, cartRes] = await Promise.all([
        promotionService.getPromotions({ status: 1, limit: 1000 }).catch(() => ({ data: { data: { items: [] } } })),
        promotionItemService.getItems().catch(() => ({ data: { data: [] } })),
        UserVoucherService.getUserVouchers({ limit: 100 }).catch(() => ({ data: { data: { items: [] } } })),
        VoucherService.getVouchers({ limit: 100, status: 1 }).catch(() => ({ data: { data: { items: [] } } })),
        CartService.getCartByUser().catch(() => ({ data: { data: null } })),
      ]);

      setAllPromotions(promoRes.data?.data?.items || []);
      setPromotions(promoItemsRes.data?.data || []);
      setUserVouchers(uvRes.data?.data?.items || []);
      setSystemVouchers(vRes.data?.data?.items || []);

      const currentCart = cartRes.data?.data || cartRes.data;
      setCart(currentCart || null);

      if (!currentCart) {
        setItems([]);
        setBundles([]);
        return;
      }

      const normalItems = (currentCart.CartItems || [])
        .filter(ci => !ci.bundle_id)
        .map(ci => {
          const variant = ci.Variant || null;
          const product = variant?.Product || ci.Product || { name: ci.name || "Unknown Product", thumbnail: ci.thumbnail || "" };
          return { ...ci, Variant: variant, Product: product, quantity: ci.quantity || 1 };
        });

      setItems(normalItems);

      const bundlesNormalized = (currentCart.bundles || []).map(b => ({
        id: b.cart_item_id,
        bundle_id: b.bundle_id,
        name: b.name || `Combo #${b.bundle_id}`,
        discount_type: b.discount_type || null,
        discount_value: b.discount_value || 0,
        start_date: b.start_date,
        end_date: b.end_date,
        status: b.status || 1,
        quantity: b.quantity || 1,
        comboItems: (b.items || []).map(ci => {
          const variant = ci.Variant || null;
          const product = variant?.Product || ci.Product || { name: ci.name || "Unknown Product", thumbnail: ci.thumbnail || "" };
          return { ...ci, Variant: variant, Product: product, quantity: ci.quantity || 1 };
        }),
      }));

      setBundles(bundlesNormalized);
      setSelectedItems(prev => prev.filter(id => normalItems.some(i => i.id === id)));

    } catch (err) {
      console.error("Lỗi fetchCartData:", err);
      resetStates();
    } finally {
      setLoading(false);
    }
  }, [token, resetStates]);

  useEffect(() => {
    fetchCartData();
  }, [fetchCartData]);

  // ===================== SELECT =====================
  const toggleSelectItem = (id) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const clearSelectedItems = async () => {
    try {
      if (!selectedItems.length) return;
      await Promise.all(selectedItems.map(id => CartItemService.deleteCartItem(id)));
      setSelectedItems([]);
      await fetchCartData();
    } catch (err) {
      console.error("Lỗi clearSelectedItems:", err.response?.data || err.message);
    }
  };

  const removeItemsAfterCheckout = async (itemIds = [], bundleCartItemIds = []) => {
    try {
      const allIdsToDelete = [...itemIds, ...bundleCartItemIds];
      if (allIdsToDelete.length === 0) return;
      await Promise.all(allIdsToDelete.map(id => CartItemService.deleteCartItem(id)));
      await fetchCartData();
    } catch (err) {
      console.error("Lỗi khi xóa sản phẩm sau thanh toán:", err);
    }
  };

  const getSelectedItems = () => items.filter(i => selectedItems.includes(i.id));

  const getSelectedTotal = () => {
    return getSelectedItems().reduce((sum, i) => sum + getFinalPrice(i) * i.quantity, 0);
  };

  // ===================== PRICE =====================
  const getFinalPrice = (item) => {
    if (!item) return 0;
    const productObj = item.Variant?.Product || item.Product || item;
    const basePrice = Number(item.Variant?.price || productObj?.price || 0);
    let bestPrice = basePrice;
    const now = new Date();

    allPromotions.forEach(promo => {
      if (Number(promo.status) !== 1) return;
      if (promo.start_date && now < new Date(promo.start_date)) return;
      if (promo.end_date && now > new Date(promo.end_date)) return;

      const campaignItems = promotions.filter(pi => String(pi.promotion_id) === String(promo.id));
      if (campaignItems.some(pi => isMatch(productObj, pi))) {
        let discounted = basePrice;
        if (promo.type === "percent") discounted = basePrice * (1 - Number(promo.value) / 100);
        else if (promo.type === "fixed") discounted = basePrice - Number(promo.value);
        if (discounted < bestPrice) bestPrice = discounted;
      }
    });
    return Math.max(0, Math.round(bestPrice));
  };

  const getTotalCartAmount = () => {
    const totalItems = items.reduce((sum, i) => sum + getFinalPrice(i) * i.quantity, 0);
    const totalBundles = bundles.reduce((sum, b) => {
      const rawTotal = (b.comboItems || []).reduce((sum2, i) => sum2 + getFinalPrice(i) * i.quantity, 0);
      let finalPrice = rawTotal;
      if (b.discount_type === "percent") finalPrice = rawTotal * (1 - Number(b.discount_value) / 100);
      else if (b.discount_type === "fixed") finalPrice = rawTotal - Number(b.discount_value);
      else if (b.price) finalPrice = b.price;
      return Math.max(0, finalPrice) * (b.quantity || 1);
    }, 0);
    return totalItems + totalBundles;
  };

  const ensureCart = async () => {
    if (cart?.id) return cart.id;
    const res = await CartService.createCart({});
    const newCart = res.data?.data || res.data;
    setCart(newCart);
    return newCart.id;
  };

  // ===================== ACTIONS (FIXED) =====================
  const addItem = async (product, quantity = 1, variantId = null) => {
    try {
      const cartId = await ensureCart();
      
      // ✅ Sửa lỗi: Luôn đảm bảo có variant_id nếu product có Variants
      const finalVariantId = variantId || product.variant_id || (product.Variants && product.Variants[0]?.id);
      
      const payload = { 
        cart_id: Number(cartId), 
        quantity: Number(quantity) 
      };

      if (finalVariantId) {
        payload.variant_id = Number(finalVariantId);
      } else {
        payload.product_id = Number(product.id);
      }

      const res = await CartItemService.addToCart(payload);

      // Phụ kiện kèm theo
      const accRes = await productAccessoryService.getByProduct(product.id);
      const accessories = accRes.data?.data || [];
      for (const acc of accessories) {
        await CartItemService.addToCart({
          cart_id: Number(cartId),
          product_id: Number(acc.accessory_id),
          quantity: Number(quantity),
          parent_id: res.data?.data?.id,
        });
      }

      await fetchCartData();
    } catch (err) {
      console.error("Lỗi addItem:", err.response?.data || err.message);
    }
  };

  const addBundle = async (bundleId, quantity = 1) => {
    try {
      if (!bundleId) throw new Error("Bundle ID is required");
      const cartId = await ensureCart();
      await CartItemService.addToCart({ cart_id: Number(cartId), bundle_id: Number(bundleId), quantity: Number(quantity) });
      await fetchCartData();
    } catch (err) {
      console.error("Lỗi addBundle:", err.response?.data || err.message);
    }
  };

  const updateItem = async (item, quantity) => {
    try {
      if (quantity < 1) return deleteItem(item);
      await CartItemService.updateCartItem(item.id, Number(quantity));
      await fetchCartData();
    } catch (err) {
      console.error("Lỗi updateItem:", err);
    }
  };

  const deleteItem = async (item) => {
    try {
      await CartItemService.deleteCartItem(item.id);
      await fetchCartData();
    } catch (err) {
      console.error("Lỗi deleteItem:", err.response?.data || err.message);
    }
  };

  const clearCart = async () => {
    try {
      if (!cart?.id) return;
      await CartItemService.clearCart(cart.id);
      setItems([]);
      setBundles([]);
      await fetchCartData();
    } catch (err) {
      console.error("Lỗi clearCart:", err.response?.data || err.message);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart, items, bundles, loading,
        userVouchers, systemVouchers,
        selectedVoucher, setSelectedVoucher,
        selectedItems, toggleSelectItem,
        clearSelectedItems, removeItemsAfterCheckout,
        getSelectedItems, getSelectedTotal,
        addItem, addBundle, updateItem, deleteItem, clearCart,
        getFinalPrice, getTotalCartAmount,
        refreshCart: fetchCartData,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);