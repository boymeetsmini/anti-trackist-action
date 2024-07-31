import { REST, Routes, Client, GatewayIntentBits } from "discord.js";

const commands = [
  {
    name: "ping",
    description: "Replies with Pong!",
  },
];

const rest = new REST({ version: "10" }).setToken(TOKEN);

try {
  console.log("Started refreshing application (/) commands.");
  
  await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
  
  console.log("Successfully reloaded application (/) commands.");
}
catch (error) {
  console.error(error);
}

const client = new Client({ intents: [ GatewayIntentBits.Guilds ]});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;
 
  // TODO Detect URL and perform anti-trackist action on it EZ Clap
  if (interaction.commandName === 'ping') {
    await interaction.reply("Pong!");
  }
});

client.login(TOKEN);