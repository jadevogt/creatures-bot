/**
 *
 * @param {import("discord.js").Guild} guild
 * @param string channelName
 * @param number channelType
 */
export async function getChannelForGuild(guild, channelName, channels) {
  const channelsList = channels ?? (await guild.channels.fetch());
  let foundChannel = [...channelsList.values()].find(
    (channel) => channel.name === channelName
  );
  return foundChannel;
}
