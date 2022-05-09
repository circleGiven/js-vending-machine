import { VENDING_MACHINE } from './constants/vending-machine-constant.js';

const COIN_LIST = [500, 100, 50, 10];

const LOCALSTORAGE_VENDING_MACHINE_MANAGE_KEY =
  'circlegivenVendingMachineManage';

const getChargedAmountFromLocalStorage = () =>
  JSON.parse(localStorage.getItem(LOCALSTORAGE_VENDING_MACHINE_MANAGE_KEY));

const updateChargedAmountFromLocalStorage = (amount) => {
  localStorage.setItem(LOCALSTORAGE_VENDING_MACHINE_MANAGE_KEY, amount);
};

const isEmpty = (value) =>
  value === undefined || value === null || value.trim() === '';

const shuffle = (list) => (list ?? []).sort(() => Math.random() - 0.5);

const VendingMachineManage = (() => {
  let chargedAmount = getChargedAmountFromLocalStorage() ?? 0;

  const updateChargedAmount = (amount) => {
    chargedAmount = amount;
  };

  const chargeAmount = (money) => {
    updateChargedAmount(chargedAmount + Number(money));
  };

  const chargedCoinList = () => {
    let remainChargedAmount = chargedAmount;
    return shuffle(COIN_LIST)
      .map((coin) => {
        const coinQuantity = Math.floor(remainChargedAmount / coin);
        remainChargedAmount -= coinQuantity * coin;
        return { name: coin, quantity: coinQuantity };
      }, [])
      .sort((prev, next) => next.name - prev.name);
  };

  const validateChargeAmount = (money) => {
    if (isEmpty(money)) {
      throw new Error('충전금액은 필수값입니다.');
    }
    if (money < VENDING_MACHINE.MIN_CHARGING_COIN) {
      throw new Error(
        `충전금액은 ${VENDING_MACHINE.MIN_CHARGING_COIN} 보다 커야됩니다.`
      );
    }

    if (money % VENDING_MACHINE.STEP_CHARGING_COIN !== 0) {
      throw new Error(
        `충전금액은 ${VENDING_MACHINE.STEP_CHARGING_COIN} 단위여야 합니다.`
      );
    }
  };

  const handleChargeCoin = (money) => {
    validateChargeAmount(money);
    chargeAmount(money);
    updateChargedAmountFromLocalStorage(chargedAmount);
  };

  return {
    chargedAmount() {
      return chargedAmount;
    },
    chargedCoinList,
    chargeCoin: handleChargeCoin,
  };
})();
export default VendingMachineManage;
