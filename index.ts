import 'dotenv/config';
import { Client, GatewayIntentBits, Message, PartialMessage, GuildTextBasedChannel } from 'discord.js';
import { cleanUrl, pullWhitelist, replaceUrls } from './src/helpers';

async function cleanupMessage(message: Message) {
    // Ignore messages from the bot itself
    if (message.author.bot) return;

    // Find URLs in the message using a regex
    const urlRegex = /http.?:\/\/[^\n\s\[\]\(\)]+/g;  // excludes all spaces, brackets and parenthesis after http:// or https://
    const urls: string[] | null = message.content.match(urlRegex);
    if (urls && urls.length === 0) return;

    // Clean the URLs
    const cleanedUrls = urls?.map((url) => cleanUrl(url));

    // Replace URLs and edit message contents
    const cleanedMsg = replaceUrls(message.content, urls, cleanedUrls)
    await message.delete();
    await (message.channel as GuildTextBasedChannel).send(cleanedMsg);
}

// Create a new Discord client with the necessary intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// Event: When the bot is ready
client.once('ready', async () => {
    console.log(`Logged in as ${client.user?.tag}`);
    await pullWhitelist();
});

// Event: When a message is created
client.on('messageCreate', async (message: Message) => {
    console.log(`Cleaning up new message: ${message.content}`);
    await cleanupMessage(message);
});

// Event: When a message is edited/updated
client.on('messageUpdate', async (oldMessage: Message | PartialMessage, newMessage: Message) => {
    console.log(`Cleaning up edited message: ${newMessage.content}`);
    await cleanupMessage(newMessage);
});

// Log in to Discord with your bot token
// TODO store token in launch config
client.login(process.env.DISCORD_TOKEN);