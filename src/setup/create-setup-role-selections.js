import { loadRolesConfiguration } from "../config/environment.js";
import { getChannelForGuild } from "../utilities/channels.js";
import { roleSelectMenu } from "../ui/role-select.js";
const SETUP_CHANNEL_NAME = process.env.SETUP_CHANNEL_NAME;

/**
 *
 * @param {import("discord.js").Guild} guild
 * @param {import("discord.js").TextChannel} channel
 * @param string roleCategory
 */

async function createOrReturnRoleSelectionMessage(
  guild,
  channel,
  roleCategory
) {
  let categoryLabel =
    roleCategory.charAt(0).toUpperCase() + roleCategory.slice(1);
  categoryLabel = categoryLabel.endsWith("s")
    ? categoryLabel.slice(0, -1)
    : categoryLabel;
  const header = `### ${categoryLabel} Roles`;
  let channelMessages = await channel.messages.fetch({ limit: 100 });
  let foundMessage = [...channelMessages.values()].find((message) =>
    message.content.includes(header)
  );
  const rows = roleSelectMenu(guild, roleCategory);
  if (foundMessage === undefined) {
    foundMessage = await channel.send({
      content: header,
      components: rows,
    });
  } else {
    foundMessage.edit({
      content: header,
      components: rows,
    });
  }
  return foundMessage;
}

/**
 *
 * @param {import("discord.js").Guild} guild
 */
async function createRoleSelectionMessagesForGuild(guild) {
  const channel = await getChannelForGuild(guild, SETUP_CHANNEL_NAME);
  const roleCategories = [
    ...new Set(loadRolesConfiguration().map((r) => r.roleCategory)),
  ];
  for (const roleCategory of roleCategories) {
    await createOrReturnRoleSelectionMessage(guild, channel, roleCategory);
  }
}

/**
 *
 * @param {import("discord.js").Client} client
 */
export default async function createSetupRoleMessages(client, guild) {
  try {
    if (guild === undefined) {
      const partialGuilds = await client.guilds.fetch();
      for (const guildId of partialGuilds.keys()) {
        const guild = await client.guilds.fetch(guildId);
        await createRoleSelectionMessagesForGuild(guild);
      }
    } else {
      await createRoleSelectionMessagesForGuild(guild);
    }
  } catch (error) {
    console.error("Error creating role selection messages:", error);
  }
}
