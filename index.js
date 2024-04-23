import { config } from "dotenv";
import { Client, GatewayIntentBits } from "discord.js";
import fetch from "node-fetch";

config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

function getQuote() {
  return fetch("https://zenquotes.io/api/random")
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch");
      }
      return res.json();
    })
    .then((data) => {
      return data[0]["q"] + " -" + data[0]["a"];
    });
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", (msg) => {
  if (msg.author.bot) return;

  if (msg.content === "$motivate") {
    getQuote().then((quote) => {
      msg.channel.send(quote);
    });
  }
});

client.login(process.env.BOT_TOKEN);
