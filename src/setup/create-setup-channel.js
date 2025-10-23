import { ChannelType } from "discord.js";
import { getChannelForGuild } from "../utilities/channels.js";
const SETUP_CHANNEL_NAME = process.env.SETUP_CHANNEL_NAME;
const CHANNEL_CATEGORY_NAME = process.env.CHANNEL_CATEGORY_NAME;

/**
 *
 * @param {import("discord.js").Guild} guild
 * @param string channelName
 * @param number channelType
 */
async function createOrReturnChannel(guild, channelName, channelType) {
  let foundChannel = await getChannelForGuild(guild, channelName);
  if (foundChannel !== undefined && foundChannel.type !== channelType) {
    // await foundChannel.delete();
    // foundChannel = undefined;
  }
  if (foundChannel === undefined) {
    foundChannel = await guild.channels.create({
      name: channelName,
      type: channelType,
    });

    foundChannel.setPosition(0);
  }
  return foundChannel;
}

/**
 *
 * @param {import("discord.js").Guild} guild
 */
async function createSetupChannelForGuild(guild) {
  const categoryChannel = await createOrReturnChannel(
    guild,
    CHANNEL_CATEGORY_NAME,
    ChannelType.GuildCategory
  );

  const setupChannel = await createOrReturnChannel(
    guild,
    SETUP_CHANNEL_NAME,
    ChannelType.GuildText
  );
  if (setupChannel.parentId !== categoryChannel.id) {
    setupChannel.setParent(categoryChannel.id);
  }
}

/**
 *
 * @param {import("discord.js").Client} client
 */
export default async function createSetupChannel(client, guild) {
  try {
    if (guild === undefined) {
      const partialGuilds = await client.guilds.fetch();
      for (const guildId of partialGuilds.keys()) {
        const guild = await client.guilds.fetch(guildId);
        await createSetupChannelForGuild(guild);
      }
    } else {
      await createSetupChannelForGuild(guild);
    }
  } catch (error) {
    console.error("Error creating setup channel:", error);
  }
}
