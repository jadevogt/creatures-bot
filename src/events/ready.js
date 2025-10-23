import { Events } from "discord.js";
import createSetupChannel from "../setup/create-setup-channel.js";
import { loadRolesConfiguration } from "../config/environment.js";
import createSetupRoles from "../setup/create-setup-roles.js";
import createSetupRoleMessages from "../setup/create-setup-role-selections.js";

export default [
  {
    name: Events.ClientReady,
    once: true,

    /**
     * @param {import('discord.js').Client} client
     */
    execute: async (client) => {
      await createSetupChannel(client);
      await createSetupRoles(client);
      await createSetupRoleMessages(client);
    },
  },
];
