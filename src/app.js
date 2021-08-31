const fs = require("fs");
const path = require("path");
const { Client, Intents, Collection } = require("discord.js");
const client = new Client({
	allowedMentions: {
		parse: ["users", "roles"]
	},
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_BANS
	]
});
const config = require("./config");

const commands = new Collection();

client.on("ready", async () => {
	client.user.setPresence({
		status: "dnd",
		activity: {
			name: "the space race!",
			type: "COMPETING"
		}
	});

	const loaded = [];
	const categories = fs.readdirSync(path.join(__dirname, "modules"));
	for(const category of categories) {
		const cmds = fs.readdirSync(path.join(__dirname, "modules", category));
		for(const cmd of cmds) {
			const command = require(path.join(__dirname, "modules", category, cmd));
			commands.set(command.name, command);
			loaded.push(command);

			console.log(`Loaded command "${category}/${command.name}"`);
		}
	}

	await client.application.commands.set(loaded);
	console.log("Ready");
});

client.on("interactionCreate", interaction => {
	if(!interaction.isCommand()) return;

	const command = commands.get(interaction.commandName);
	if(!command) return interaction.reply({ content: "Uh, oh! I can't find that command. This should never happen." });

	const args = [];
	for(let option of interaction.options.data) {
		if(option.type === "SUB_COMMAND") {
			if(option.name) args.push(option.name);
			option.options?.forEach(x => {
				if(x.value) args.push(x.value);
			});
		} else if(option.value) args.push(option.value);
	}

	try {
		command.execute(client, interaction, args);
	} catch(e) {
		interaction.reply({ content: e.message });
	}
});

client.login(config.token);
