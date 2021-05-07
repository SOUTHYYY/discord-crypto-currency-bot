const axios = require("axios");

const API_URL =
  "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?convert=USD&symbol=";

module.exports = getCurrentCryptoTicker = async (ticker) => {
  try {
    return await axios
      .get(`${API_URL}${ticker}`, {
        headers: {
          "X-CMC_PRO_API_KEY": process.env.API_TOKEN,
        },
      })
      .then((response) => response.data);
  } catch (err) {
    return { error: true };
  }
};
