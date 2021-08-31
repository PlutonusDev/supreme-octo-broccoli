const wait = require("util").promisify(setTimeout);
const alpaca = new(require("../../trader"));

module.exports = {
	name: "trade",
	description: "Create a trade on the NYSE.",
	options: [
		{
			type: "STRING",
			name: "position",
			description: "Whether to buy or sell the stock.",
			required: true,
			choices: [{name:"buy",value:"buy"}, {name:"sell",value:"sell"}]
		},
		{
			type: "STRING",
			name: "symbol",
			description: "The stock symbol for a publicly-traded security on the NYSE.",
			required: true
		},
		{
			type: "INTEGER",
			name: "quantity",
			description: "The quantity of shares to open a position with.",
			required: true
		}
	],

	execute: async (client, interaction, args) => {
		if(args[2] > 100 || args[2] < 1) return interaction.reply({ content: "Trade quantity must be between 1 and 100.", ephemeral: true });
		const symbol = await alpaca.getAsset(args[1].toUpperCase()).catch(()=>{});
		const trade = await alpaca.lastTrade(args[1].toUpperCase()).catch(()=>{});
		if(!symbol) return interaction.reply({ content: `${args[1].toUpperCase()} couldn't be found on the NYSE.`, ephemeral: true });

		await interaction.reply({ embeds: [{
			title: "Preparing Trade...",
			description: `You are about to open the following trade:\n\n**__${symbol.name} @ ${symbol.exchange}__**\n\`${args[0].toUpperCase()} ${args[2]} x ${symbol.symbol} @ ${trade.last.price}\`\n\nThis will cost an __estimated__ $${(trade.last.price*args[2]).toFixed(2)}.\n\n*15 seconds before trade opportunity expires...*`
		}],
		components: [{
			type: 1,
			components: [{
				type: 2,
				style: 3,
				label: "Open Position",
				custom_id: "start-trade"
			}, {
				type: 2,
				style: 4,
				label: "Cancel",
				custom_id: "cancel-trade"
			}]
		}]});

		const cmd = await interaction.fetchReply();
		//return console.log(msg);

		cmd.awaitMessageComponent({ filter: i => i.user.id === interaction.user.id, time: 15000 }).then(i => {
			if(i.customId === "start-trade") return interaction.editReply({content:"Trade"});
			interaction.editReply({content:"Nope"});
		}).catch(() => {
			interaction.editReply({ embeds: [{
				title: "Trade Cancelled",
				description: "You took too long to confirm the position, and the price expired."
			}]});
		});
	}
}
