export const paymentConfig = {
  currency: "USD",

  minimumWithdrawal: 10,

  methods: {
    binance_trc20: {
      enabled: true,
      name: "Binance TRC20",
      field: "walletAddress"
    },

    paypal: {
      enabled: true,
      name: "PayPal",
      field: "email"
    }
  }
};
