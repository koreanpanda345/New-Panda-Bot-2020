// eslint-disable-next-line no-unused-vars
const PandaBot = require("../PandaBot");


module.exports = class CommandBase
{

	constructor(client, {
		name = null,
		description = "No Description Provided.",
		category = "Miscellaneous",
		usage = "No Usage Provided.",
		enabled = true,
		guildOnly = false,
		aliases = new Array()
	})
	{
		/**
		 * @type {PandaBot}
		 */
		this.client = client;
		this.props = {name, description, category, usage, enabled, guildOnly, aliases};
	}
};