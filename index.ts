import 'dotenv/config';
import { Client, GatewayIntentBits, Message, ButtonInteraction } from 'discord.js';
import { checkUrlForTracking, pullWhitelist } from './src/helpers';
import { cleanupModal } from './src/interactions/modal'
// import EventEmitter from 'node:events';
import _ from 'lodash';

function messageContainsTracking(message: Message): boolean {
    // Ignore messages from the bot itself
    if (message.author.bot) return false;

    // Find URLs in the message using a regex
    const urlRegex = /http.?:\/\/[^\n\s\[\]\(\)]+/g;  // excl   udes all spaces, brackets and parenthesis after http:// or https://
    const urls: string[] | null = message.content.match(urlRegex);

    // Check all URLs for tracking and return true if at least 1 link has tracking
    if (urls) {
        if (urls.length === 0) {
            return false;
        } else {
            return urls?.map((url) => checkUrlForTracking(url)).reduce((x, y) => x || y);
        }
    } else {
        return false;
    }
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
    await pullWhitelist(); // pull whitelist on bot initialization
});

// Event: When a new message is created
client.on('messageCreate', async (message) => {
    console.log(`Cleaning up new message: ${message.content}`); // TODO Remove after testing!

    // If message contains tracking, trigger interactionCreate event to display warning modal.
    // TODO fake an interaction to trigger interaction event    
    if (messageContainsTracking(message)) client.emit('interactionCreate', new ButtonInteraction());
});

// TODO Event: When an existing message is updated
// client.on('messageUpdate', async (oldMessage, newMessage) => {
//     console.log(`Message being updated: ${oldMessage.content}\nNew Message: ${newMessage.content}`); // TODO Remove after testing!

//     // If message contains tracking, trigger interactionCreate event to display warning modal.
//     if (messageContainsTracking(newMessage)) client.emit('interactionCreate', interaction);
// });

// display popup modal if triggered by messageCreate event
client.on('interactionCreate', async (interaction) => {
    console.log('I\'m triggered!');
    if (interaction.isChatInputCommand()) return;
    cleanupModal();
})

// Log in to Discord with your bot token
// TODO store token in launch config
client.login(process.env.DISCORD_TOKEN);