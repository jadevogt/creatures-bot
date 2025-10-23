import { Client, GatewayIntentBits } from "discord.js";
import events from "./events/registry.js";

const token = process.env.DISCORD_BOT_TOKEN;

// Validate token exists before attempting to create client
if (!token) {
  console.error("DISCORD_BOT_TOKEN is not set in environment variables");
  throw new Error("FATAL: Token Error");
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ],
});

for (const event of events) {
  if (event.once) {
    client.once(event.name, (...argumentsList) =>
      event.execute(...argumentsList)
    );
  } else {
    client.on(event.name, (...argumentsList) =>
      event.execute(...argumentsList)
    );
  }
}

// Add error handling for login
client.login(token).catch((error) => {
  console.error("Failed to login:", error);
  throw new Error("FATAL: Login Error");
});
