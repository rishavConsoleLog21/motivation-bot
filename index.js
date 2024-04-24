import { config } from "dotenv";
import { Client, GatewayIntentBits } from "discord.js";
import fetch from "node-fetch";
import { sadWords, startEncouragements } from "./words.js";
import Database from "@replit/database";
config();

/**
 * Initiates Class.
 * @param {String} dbUrl Custom database URL
 */

const db = new Database();

db.get("encouragements").then((encouragements) => {
  if (!encouragements || encouragements.length < 1) {
    db.set("encouragements", startEncouragements);
  }
});

function updateEncouragements(encouragingMessage) {
  db.get("encouragements").then((encouragements) => {
    encouragements.push([encouragingMessage]);
    db.set("encouragements", encouragements);
  });
}

function deleteEncouragement(index) {
  db.get("encouragements").then((encouragements) => {
    if (encouragements.length > index) {
      encouragements.splice(index, 1);
      db.set("encouragements", encouragements);
    }
  });
}

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
  if (sadWords.some((word) => msg.content.includes(word))) {
    db.get("encouragements").then((encouragements) => {
      const encouragement =
        encouragements[Math.floor(Math.random() * encouragements.length)];
      msg.reply(encouragement);
    });
  }

  if (msg.content.startsWith("$new")) {
    const encouragingMessage = msg.content.split("$new ")[1];
    updateEncouragements(encouragingMessage);
    msg.channel.send("New encouraging message added.");
  }

  if (msg.content.startsWith("$del")) {
    const index = parseInt(msg.content.split("$del ")[1]);
    deleteEncouragement(index);
    msg.channel.send("Encouraging message deleted.");
  }
});

client.login(process.env.BOT_TOKEN);
