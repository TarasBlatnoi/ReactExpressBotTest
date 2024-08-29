require("dotenv").config();
const express = require("express");
const TelegramBot = require("node-telegram-bot-api");

const token = process.env.BOT_TOKEN;
const webAppUrl = "https://reactgameguessnum.netlify.app/";
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];
  bot.sendMessage(chatId, resp);
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  if (text === "/start") {
    await bot.sendMessage(chatId, "Гра під назвою вгадай число", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Запустити гру", web_app: { url: webAppUrl } }],
        ],
      },
    });
  }
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let secretNumber = null;

app.get("/", (req, res) => {
  res.send("Home page");
});

app.post("/start_game", (req, res) => {
  secretNumber = Math.floor(Math.random() * 100) + 1;
  console.log(`Загадане число: ${secretNumber}`);
  res.json({ message: "Нова гра розпочата!" });
});

app.post("/guess", (req, res) => {
  const { number } = req.body;

  if (!secretNumber) {
    return res.json({
      message:
        "Гра ще не розпочата! Використайте /start_game для початку нової гри.",
    });
  }

  if (number > secretNumber) {
    res.json({ result: "Загадане число менше" });
  } else if (number < secretNumber) {
    res.json({ result: "Загадане число більше" });
  } else {
    secretNumber = null;
    res.json({ result: "Число вгадано! Ви можете почати нову гру." });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
