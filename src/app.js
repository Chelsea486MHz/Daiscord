require('dotenv').config();
const Discord = require('discord.js');
const { Configuration, OpenAIApi } = require("openai");

// OpenAI client configuration
const configuration = new Configuration({ apiKey: process.env.AI_TOKEN });
const openai = new OpenAIApi(configuration);

// Discord client configuration
const client = new Discord.Client({ intents: 131071 });

// Message history and pre-prompt
let messageHistory = [];
messageHistory.push({role: "system", content: `${process.env.PREPROMPT}`});

// Respond to prompts
async function getAiCompletion(prompt) {
	messageHistory.push({role: "user", content: `${prompt}`});

	try {
		const response = await openai.createChatCompletion({
			model: `${process.env.AI_MODEL}`,
			messages: messageHistory,
		});
  
		// Extract the generated text from the response
		console.log(`Completion succeeded. Response: ${response.data.choices[0].message.content}`);
		messageHistory.push({role: "assistant", content: `${response.data.choices[0].message.content}`});

		return response.data.choices[0].message.content;
	}

	catch (error) {
		console.log('Error occurred:');
		console.error(error);
  
		// Handle specific error scenarios
		if (error.response) {
			console.log(`API response status: ${error.response.status}`);
			console.log(`API response data: ${error.response.data}`);
		}

		return null;
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
	console.log(`Received message. Message: ${message}`);

	// Ignore messages from the bot itself
	if (message.author.id === client.user.id) {
		console.log('Message was from myself. Ignoring');
		return;
	}

	// Handle ping
	else if (message.content.startsWith("ping")) {
		console.log('Message is a ping request.');
		message.channel.send("pong");
	}

	// Handle conversation resets
	else if (message.content.startsWith("!reset")) {
		console.log('Resetting message history.');
		messageHistory = [];
		getAiCompletion(process.env.PREPROMPT);
	}

	// Otherwise, send to AI
	else {
		console.log('Replying using AI');

		const prompt = `${message.author.username}: ${message.content}`;
		const response = await getAiCompletion(prompt);
		console.log(`Got ChatGPT reply. Sending the following message: ${response}`);

		message.channel.send(response);
	}
});

client.login(process.env.DISCORD_TOKEN);