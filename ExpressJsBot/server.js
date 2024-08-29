require("dotenv").config();
const express = require("express");
const cors = require("cors");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

const token = process.env.BOT_TOKEN;
const webAppUrl = "https://reactexpressguessnumgame.netlify.app/";
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

let randomNumber = null;

app.get("/", (req, res) => {
  res.send("Home page");
});

app.post("/start_game", (req, res) => {
  randomNumber = Math.floor(Math.random() * 100) + 1;
  res.json({
    message: "Гру розпочато",
  });
});

app.post("/guess", (req, res) => {
  const { number } = req.body;
  console.log(number);
  console.log({ randomNumber });
  if (!randomNumber) {
    return res.json({
      message:
        "Гра ще не розпочата! Використайте /start_game для початку нової гри.",
    });
  }

  if (number > randomNumber) {
    res.json({
      message: "Загадане число менше",
      won: false,
    });
  } else if (number < randomNumber) {
    res.json({
      message: "Загадане число більше",
      won: false,
    });
  } else {
    randomNumber = null;
    res.json({
      message: "Число вгадано! Ви можете почати нову гру.",
      won: true,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
