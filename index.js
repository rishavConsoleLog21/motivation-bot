import { Client, GatewayIntentBits } from "discord.js";
import fetch from "node-fetch";
import { config } from "dotenv";
import  keepAlive from "./server.js";
config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

function getQuote() {
  return fetch("https://zenquotes.io/api/random")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      return data[0]["q"] + " -" + data[0]["a"];
    });
}

client.on("messageCreate", (msg) => {
  if (msg.author.bot) return;

  if (msg.content === "$motivate") {
    getQuote().then((quote) => msg.channel.send(quote));
  }
});

keepAlive();
const mySecret = process.env["BOT_TOKEN"];
client.login(mySecret);
