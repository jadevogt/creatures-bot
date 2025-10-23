export const ROLE_PREFIX = "SA_";

export function loadRolesConfiguration() {
  return Object.keys(process.env)
    .filter((key) => key.startsWith(ROLE_PREFIX))
    .map((key) => {
      const components = key.split("_");
      const details = process.env[key].split("#");
      const roleCategory = components[1].toLowerCase();
      const roleName = details[0];
      const roleColor = details[1];
      const guildScope = components[3]?.replace("ID", "");
      return { roleName, roleCategory, roleColor, guildScope };
    });
}
