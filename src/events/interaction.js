import { Events, MessageFlags, StringSelectMenuInteraction } from "discord.js";
import { getRoleForGuild } from "../utilities/roles.js";
import { loadRolesConfiguration } from "../config/environment.js";

// Cache roles configuration on module load
let cachedRoles;

export default [
  {
    name: Events.InteractionCreate,
    /**
     *
     * @param {*} interaction
     * @returns
     */
    execute: async (interaction) => {
      // Only handle string select menu and button interactions
      if (!interaction.isStringSelectMenu() && !interaction.isButton()) {
        return;
      }

      // Only handle our role selection interactions
      if (!interaction.customId.includes("role")) {
        return;
      }

      try {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
      } catch (error) {
        console.error("Failed to defer reply:", error);
        return;
      }
      const roleCategory = interaction.customId.split("-")[1];
      const roleCategoryPrettyName = roleCategory.endsWith("s")
        ? roleCategory.slice(0, -1)
        : roleCategory;

      // Use cached roles or load them if not cached
      if (!cachedRoles) {
        cachedRoles = loadRolesConfiguration();
      }
      let roles = cachedRoles;

      // Check if bot has MANAGE_ROLES permission
      if (!interaction.guild.members.me.permissions.has("ManageRoles")) {
        await interaction.editReply({
          content:
            "I don't have permission to manage roles. Please give me the 'Manage Roles' permission.",
          flags: MessageFlags.Ephemeral,
        });
        return;
      }
      if ((interaction.values ?? []).length > 0) {
        const notSelected = roles
          .filter(
            (role) =>
              role.roleCategory.toLowerCase() === roleCategory.toLowerCase()
          )
          .filter((r) => !interaction.values.includes(r.roleName))
          .map((r) => r.roleName);
        console.log(notSelected);

        try {
          for (const roleName of interaction.values) {
            const role = await getRoleForGuild(interaction.guild, roleName);
            if (
              role &&
              role.position <
                interaction.guild.members.me.roles.highest.position
            ) {
              await interaction.member.roles.add(role);
            }
          }
          for (const roleName of notSelected) {
            const role = await getRoleForGuild(interaction.guild, roleName);
            if (
              role &&
              role.position <
                interaction.guild.members.me.roles.highest.position
            ) {
              await interaction.member.roles.remove(role);
            }
          }
          await interaction.editReply({
            content: `Set your ${roleCategoryPrettyName} roles: ${interaction.values.join(
              ", "
            )}`,
            flags: MessageFlags.Ephemeral,
          });
        } catch (error) {
          console.error("Error managing roles:", error);
          await interaction.editReply({
            content: `Something went wrong:\n\`\`\`\n${
              error.message || error
            }\n\`\`\``,
            flags: MessageFlags.Ephemeral,
          });
        }
      } else {
        const allRolesInCategory = roles
          .filter(
            (role) =>
              role.roleCategory.toLowerCase() === roleCategory.toLowerCase()
          )
          .map((r) => r.roleName);
        console.log(allRolesInCategory);

        try {
          for (const roleName of allRolesInCategory) {
            const role = await getRoleForGuild(interaction.guild, roleName);
            if (
              role &&
              role.position <
                interaction.guild.members.me.roles.highest.position
            ) {
              await interaction.member.roles.remove(role);
            }
          }
          await interaction.editReply({
            content: `Cleared your ${roleCategoryPrettyName} roles.`,
          });
        } catch (error) {
          console.error("Error clearing roles:", error);
          await interaction.editReply({
            content: `Something went wrong:\n\`\`\`\n${
              error.message || error
            }\n\`\`\``,
            flags: MessageFlags.Ephemeral,
          });
        }
      }
      return;
    },
  },
];
