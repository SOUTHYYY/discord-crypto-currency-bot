const Discord = require("discord.js");
const client = new Discord.Client();
const { prefix } = require("./config.json");
const axios = require("axios");
require("dotenv").config();

const API_URL =
  "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?convert=USD&symbol=";

client.once("ready", () => {
  console.log("Ready!");
});

client.on("message", async (message) => {
  if (!message.content.startsWith(`${prefix}get`) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(" ");
  // TODO: Crate feature with command
  // const command = args.shift().toLowerCase();

  if (!args.length) {
    return message.channel.send(
      `Привет, ${message.author} я не совсем тебя понял!\nДля помощи напиши **!get help** `
    );
  }

  const tickerArg = args[0].toUpperCase();

  if (tickerArg === "HELP") {
    return message.channel.send(
      `**Команды которые я понимаю:**\n!get {Тикер Криптовалюты} - !get BTC`
    );
  }
  try {
    const payload = await axios
      .get(`${API_URL}${tickerArg}`, {
        headers: {
          "X-CMC_PRO_API_KEY": process.env.API_TOKEN,
        },
      })
      .then((response) => response.data);

    const { name, quote } = payload.data[tickerArg];
    const {
      price,
      percent_change_1h,
      percent_change_24h,
      percent_change_7d,
    } = quote.USD;

    return message.channel.send(
      `🔥 **${name}**

🚀 Цена сейчас: $${price.toFixed(1)}

🕛 Изменения за последний час: ${percent_change_1h.toFixed(1)}%
🕐 За 24 часа : ${percent_change_24h.toFixed(1)}%
🕝 За 7 дней: ${percent_change_7d.toFixed(1)}%`
    );
  } catch {
    return message.channel.send("Чот сломалось");
  }
});

client.login(process.env.BOT_TOKEN);
