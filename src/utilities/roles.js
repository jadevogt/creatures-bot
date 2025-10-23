/**
 *
 * @param {import("discord.js").Guild} guild
 * @param string channelName
 * @param number channelType
 */
export async function getRoleForGuild(guild, roleName) {
  const roles = await guild.roles.fetch();
  let foundRole = [...roles.values()].find((role) => role.name === roleName);
  return foundRole;
}
