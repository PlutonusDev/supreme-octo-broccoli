const wait = require("util").promisify(setTimeout);
const alpaca = new(require("../../trader"));

module.exports = {
	name: "equity",
	description: "Check a user's equity.",
	options: [
		{
			type: "USER",
			name: "user",
			description: "The user whose equity you'd like to view.",
			required: false
		}
	],

	execute: async (client, interaction, args) => {
		const acc = await alpaca.getAccount();
		interaction.reply({ embeds: [{
			title: "Equity Information",
			description: `**Current Equity** - $${acc.equity} ${acc.currency}\n**Buying Power** - $${acc.buying_power} ${acc.currency}`
		}]});
	}
}
