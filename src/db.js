const mongoose = require("mongoose");

module.exports = class DBConnection {
	constructor() {
		this.connection = mongoose.connection;
		mongoose.connect("mongodb://localhost/trading", {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});

		return this;
	}
}
