import { PURCHASE } from './constants/purchase-constant.js';
import ProductManage from './ProductManage.js';

const LOCALSTORAGE_PRODUCT_PURCHASE_KEY = 'circlegivenProductPurchase';

const getChargedCostFromLocalStorage = () =>
  JSON.parse(localStorage.getItem(LOCALSTORAGE_PRODUCT_PURCHASE_KEY));

const updateChargedCostFromLocalStorage = (cost) => {
  localStorage.setItem(LOCALSTORAGE_PRODUCT_PURCHASE_KEY, cost);
};

const isEmpty = (value) =>
  value === undefined || value === null || value.trim() === '';

const ProductPurchase = (() => {
  let totalChargedCost = getChargedCostFromLocalStorage() ?? 0;

  const updateChargedCost = (cost) => {
    totalChargedCost = cost;
  };

  const chargeCost = (money) => {
    updateChargedCost(totalChargedCost + Number(money));
  };

  const subtractChargedCost = (price) => {
    updateChargedCost(totalChargedCost - Number(price));
  };

  const validateChargeCost = (money) => {
    if (isEmpty(money)) {
      throw new Error('충전금액은 필수값입니다.');
    }
    if (money < PURCHASE.MIN_CHARGING_COIN) {
      throw new Error(
        `충전금액은 ${PURCHASE.MIN_CHARGING_COIN} 보다 커야됩니다.`
      );
    }

    if (money % PURCHASE.STEP_CHARGING_COIN !== 0) {
      throw new Error(
        `충전금액은 ${PURCHASE.STEP_CHARGING_COIN} 단위여야 합니다.`
      );
    }
  };

  const validatePurchase = (price) => {
    if (totalChargedCost - price < 0) {
      throw new Error('충전금액이 모자릅니다. 상품을 구매할수 없습니다.');
    }
  };

  const handleChargeCost = (money) => {
    validateChargeCost(money);
    chargeCost(money);
    updateChargedCostFromLocalStorage(totalChargedCost);
  };

  const handlePurchase = (product) => {
    validatePurchase(product.price);
    ProductManage.purchaseProduct(product.name);
    subtractChargedCost(product.price);
    updateChargedCostFromLocalStorage(totalChargedCost);
  };

  return {
    chargedCost() {
      return totalChargedCost;
    },
    chargeCost: handleChargeCost,
    purchase: handlePurchase,
  };
})();
export default ProductPurchase;
