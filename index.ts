import { Client, GatewayIntentBits, Message } from 'discord.js';
import { URL, URLSearchParams } from 'url';
import fs from 'fs';
import { parse } from 'csv-parse';

const WHITELIST_FILE = 'src/data/param_wlist.csv';

// Function to find all whitelisted params for a domain match
async function whitelistMatches(domain: string): Promise<string[]> {
    const wList: any[] = [];
    const parser = fs.createReadStream(WHITELIST_FILE)
        .pipe(parse({
            delimiter: ",",
        }));
    
    for await (const record of parser) {
        wList.push(record);
    }

    return wList.filter((listItem) => listItem[0] === domain).map((listItem) => listItem[1]);
}

// Function to clean URLs by removing tracking parameters
function cleanUrl(url: string): string {
    const parsedUrl = new URL(url);

    // Remove tracking parameters (e.g., utm_*)
    const searchParams = new URLSearchParams(parsedUrl.search);
    for (const key of searchParams.keys()) {
        // TODO create whitelist of parameters for certain domains (i.e. youtube, X, bsky, etc.)
        if (key === 'utm_') {
            searchParams.delete(key);
        }
    }

    // Rebuild the URL without tracking parameters
    parsedUrl.search = searchParams.toString();
    return parsedUrl.toString();
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

// Event: When a message is sent
client.on('messageCreate', async (message: Message) => {
    // Ignore messages from the bot itself
    if (message.author.bot) return;

    // Find URLs in the message using a regex
    const urlRegex = /https?:\/\/[^\s]+/g;
    const urls = message.content.match(urlRegex);

    if (urls && urls.length > 0) {
        // Clean the URLs
        const cleanedUrls = urls.map((url) => cleanUrl(url));

        // Reply with the cleaned URLs
        // await message.reply(`Cleaned URLs:\n${cleanedUrls.join('\n')}`);

        // TODO reconstruct the message with cleaned URLs
    }
});

// Log in to Discord with your bot token
client.login('YOUR_DISCORD_BOT_TOKEN');