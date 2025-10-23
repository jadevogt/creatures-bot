import { loadRolesConfiguration } from "../config/environment.js";

/**
 *
 * @param {import("discord.js").Guild} guild
 */
async function createOrReturnRole(guild, roleObject) {
  const roles = await guild.roles.fetch();
  let foundRole = [...roles.values()].find(
    (role) => role.name === roleObject.roleName
  );
  if (foundRole === undefined) {
    let newRole = {
      name: roleObject.roleName,
    };
    if (roleObject.roleColor !== undefined) {
      newRole.colors = {
        primaryColor: `#${roleObject.roleColor}`,
      };
    }
    foundRole = await guild.roles.create(newRole);
  }
  return foundRole;
}

/**
 *
 * @param {import("discord.js").Guild} guild
 */
async function createSetupRolesForGuild(guild) {
  const roles = loadRolesConfiguration();
  for (const role of roles) {
    await createOrReturnRole(guild, role);
  }
}

/**
 *
 * @param {import("discord.js").Client} client
 */
export default async function createSetupRoles(client, guild) {
  try {
    if (guild === undefined) {
      const partialGuilds = await client.guilds.fetch();
      for (const guildId of partialGuilds.keys()) {
        const guild = await client.guilds.fetch(guildId);
        await createSetupRolesForGuild(guild);
      }
    } else {
      await createSetupRolesForGuild(guild);
    }
  } catch (error) {
    console.error("Error creating setup roles:", error);
  }
}
