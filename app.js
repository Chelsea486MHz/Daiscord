require('dotenv').config();
const axios = require('axios');
const Discord = require('discord.js');

console.log('Starting dAIscord with the following settings:')
console.log(`Discord token: ${process.env.DISCORD_TOKEN}`);
console.log(`AI token: ${process.env.AI_TOKEN}`);
console.log(`AI URI: ${process.env.AI_URI}`);
console.log(`PREPROMPT: ${process.env.PREPROMPT}`);

// Discord client configuration
const client = new Discord.Client({ intents: 67584 });

// Message history
let messageHistory = '';

// Respond to prompts
async function getAiCompletion(prompt) {
	messageHistory += `${prompt}\n`;
	console.log('Requesting AI completion for the following prompt:');
	console.log(prompt);

	// Send the prompt, wait for completion
    try {
        const response = await axios.post(process.env.AI_URI, {
			text: prompt
		}, {
			headers: {
				'Authorization': process.env.AI_TOKEN,
				'Content-Type': 'application/x-www-form-urlencoded'
			},
		responseType: 'blob'
		});

		// Return the completion
		console.log('Received completion:');
		console.log(response.data)
		return response.data;

    } catch (error) {
        console.error('Error occurred while requesting completion:', error);
        throw error;
    }
}

// Set up Discord bot events
client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', interaction => {
	console.log(interaction);
});

client.on("messageCreate", async message => {
	console.log('Received message. Message:');
	console.log(message);
	const voiceChannel = message.member?.voice.channel;

	// Ignore messages from the bot itself
	if (message.author.id === client.user.id) {
		console.log('Message was from myself. Ignoring');
		return;
	}

	// Handle ping
	else if (message.content.startsWith("ping")) {
		console.log('Message is a ping request. Ignoring');
		message.channel.send("pong");
	}

	// Otherwise, send to AI
	else {
		console.log('Replying using AI');

		const prompt = `${message.author.username}: ${message.content}`;
		const response = await getAiCompletion(prompt);
		console.log('Got ChatGPT reply. Sending the following message:');
		console.log(response);

		message.channel.send(response);
	}
});

// Pre-prompt
var preprompt = process.env.PREPROMPT;
getAiCompletion(preprompt);

client.login(process.env.DISCORD_TOKEN);