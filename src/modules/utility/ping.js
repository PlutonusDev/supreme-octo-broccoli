const wait = require("util").promisify(setTimeout);

module.exports = {
	name: "ping",
	description: "See if the bot is running.",
	options: [],

	execute: async (client, interaction, args) => {
		let start = Date.now();

		await interaction.reply({ embeds: [{
			title: ":ping_pong: Ping!",
			description: "Measuring API latency and bot latency..."
		}], ephemeral: true});

		let end = Date.now();
		await wait(3000);

		interaction.editReply({ embeds: [{
			title: ":ping_pong: Pong!",
			description: `**API Latency** is ~${Math.round(client.ws.ping)}ms.\n**Client Latency** is ~${end - start}ms`
		}]});
	}
}
