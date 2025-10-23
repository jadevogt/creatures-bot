import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import { loadRolesConfiguration } from "../config/environment.js";

/**
 * @param {import('discord.js').Guild} guild
 * @param string roleCategory
 */
export function roleSelectMenu(guild, roleCategory) {
  let roles = loadRolesConfiguration();
  roles = roles.filter((role) => role.roleCategory === roleCategory);
  if (roles.length === 0) return;
  const optionsList = roles.map((role) => {
    return new StringSelectMenuOptionBuilder()
      .setLabel(role.roleName)
      .setValue(role.roleName);
  });
  const roleCategoryPrettyName = roleCategory.endsWith("s")
    ? roleCategory.slice(0, -1)
    : roleCategory;
  const clearRoles = new ButtonBuilder()
    .setCustomId(`${guild.id}-${roleCategory}-clear-self-assigned-roles`)
    .setLabel(
      `Clear ${
        roleCategoryPrettyName.charAt(0).toUpperCase() +
        roleCategoryPrettyName.slice(1)
      } Roles`
    )
    .setStyle(ButtonStyle.Danger);

  const select = new StringSelectMenuBuilder()
    .setCustomId(`${guild.id}-${roleCategory}-self-assigned-roles`)
    .setPlaceholder(`Select ${roleCategoryPrettyName} roles`)
    .setMinValues(1)
    .setMaxValues(roles.length)
    .addOptions(optionsList);
  const row = new ActionRowBuilder().addComponents(select);
  const rowTwo = new ActionRowBuilder().addComponents(clearRoles);
  return [row, rowTwo];
}
