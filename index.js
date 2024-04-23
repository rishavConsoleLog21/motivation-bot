import { config } from "dotenv";
import { Client, GatewayIntentBits } from "discord.js";

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

client.on("message", (msg) => {
  if (msg.content === "ping") {
    msg.reply("pong");
  }
});

client.login(process.env.BOT_TOKEN);
