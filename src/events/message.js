import { Events } from "discord.js";

export default [
  {
    name: Events.MessageCreate,
    execute: (message) => {
      return;
    },
    once: true,
  },
];
