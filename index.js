const Discord = require("discord.js");
const client = new Discord.Client();
const { prefix } = require("./config.json");
const getCurrentCryptoTicker = require("./apiService");
require("dotenv").config();

client.once("ready", () => {
  console.log("Ready!");
});

client.on("message", async (message) => {
  if (!message.content.startsWith(`${prefix}get`) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(" ");
  // TODO: Crate feature with command
  const command = args.shift().toLowerCase();

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
  const payload = await getCurrentCryptoTicker(tickerArg);

  if (payload.error) {
    return message.channel.send(
      `Мне не удалось получить данные о: ${tickerArg}. Попробуй еще раз!`
    );
  }

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
});

client.login(process.env.BOT_TOKEN);
