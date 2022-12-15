import { config } from "../app";

import { REST, Routes, SlashCommandBuilder } from "discord.js";

const commands = [
  {
    name: "usage",
    description: "Affiche l'utilisation de l'api de deepl !",
  },
];

export const UpdateCommand = async () => {
  const rest = new REST({ version: "10" }).setToken(config.token);
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(config.clientid), {
      body: commands,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
};
