import { Client, GatewayIntentBits, Message, PartialMessage } from 'discord.js';
import { cleanUrl, replaceUrls } from './src/helpers';

async function cleanupMessage(message: Message) {
    // Ignore messages from the bot itself
    if (message.author.bot) return;

    // Find URLs in the message using a regex
    const urlRegex = /http.?:\/\/[^\n\s\[\]\(\)]+/g;  // excludes all spaces, brackets and parenthesis after http:// or https://
    const urls: string[] | null = message.content.match(urlRegex);
    if (urls && urls.length === 0) return;

    // Clean the URLs
    const cleanedUrls = urls?.map(async (url) => await cleanUrl(url));

    // Replace URLs and edit message contents
    message.edit(replaceUrls(message.content, urls, cleanedUrls));
}

// Create a new Discord client with the necessary intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// Event: When the bot is ready
client.once('ready', () => {
    console.log(`Logged in as ${client.user?.tag}`);
});

// Event: When a message is created
client.on('messageCreate', async (message: Message) => {
    await cleanupMessage(message);
});

// Event: When a message is edited/updated
client.on('messageUpdate', async (oldMessage: Message | PartialMessage, newMessage: Message) => {
    await cleanupMessage(newMessage);
});

// Log in to Discord with your bot token
// TODO store token in launch config
client.login('YOUR_DISCORD_BOT_TOKEN');