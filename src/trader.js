const alpaca = require("@alpacahq/alpaca-trade-api");
const config = require("./config");

module.exports = class AlpacaConnection {
	constructor() {
		this.alpaca = new alpaca({
			keyId: config.alpaca_key,
			secretKey: config.alpaca_secret,
			paper: true,
			usePolygon: false
		});

		return this.alpaca;
	}
}
