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
async function cleanUrl(url: string): Promise<string> {
    // extract domain from URL to find whitelisted params (filter out 'www')
    const parsedUrl = new URL(url);
    const parsedDomain: string = parsedUrl.hostname.split('.').filter((x) => x !== 'www')[0];

    // Find all whitelisted params for given URL's domain
    const parsedWl = await whitelistMatches(parsedDomain);

    // Handle wildcard (*) (skip parameter delete if * present)
    if (parsedWl.indexOf('*') === -1) {
        // Remove tracking parameters (e.g., utm_*)
        const searchParams = new URLSearchParams(parsedUrl.search);
        for (const key of searchParams.keys()) {
            // delete any keys not in the whitelist for specified domain
            if (parsedWl.indexOf(key) === -1) {
                searchParams.delete(key);
            }
        }
        // Rebuild the URL without tracking parameters
        parsedUrl.search = searchParams.toString();
    }

    return parsedUrl.toString();
}

// Function to replace all URLs with cleaned ones
function replaceUrls(message: string, origUrls: string[] | null, cleanedUrls: any[] | undefined): string {
    let newMessage: string = message;

    if (cleanedUrls === undefined) {
        console.error('No URLs to clean');
        return newMessage;
    }

    origUrls?.forEach((oUrl, idx) => newMessage = newMessage.replace(oUrl, cleanedUrls[idx]));
    return newMessage;
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
    const urlRegex = /http.?:\/\/[^\n\s\[\]\(\)]+/g;  // excludes all spaces, brackets and parenthesis after http:// or https://
    const urls: string[] | null = message.content.match(urlRegex);
    if (urls && urls.length === 0) return;

    // Clean the URLs
    const cleanedUrls = urls?.map(async (url) => await cleanUrl(url));

    // Replace URLs and edit message contents
    message.edit(replaceUrls(message.content, urls, cleanedUrls));
});

// Log in to Discord with your bot token
// TODO store token in launch config
client.login('YOUR_DISCORD_BOT_TOKEN');