// eslint-disable-next-line no-unused-vars
const PandaBot = require("../PandaBot");
const {readdirSync} = require("fs");
module.exports = class EventHandler
{
	/**
	 * 
	 * @param {PandaBot} client 
	 */
	constructor(client)
	{
		this.client = client;
	}
	
	/**
	 * 
	 * @param {String} dir 
	 */
	loadEvents(dir)
	{
		const events = readdirSync(`./src/events/${dir}`).filter(d => d.endsWith(".js"));
		for(let file of events)
		{
			let eName = file.split(".")[0];
			let _evt = require(`../events/${dir}/${file}`);
			let evt = new _evt(this.client);

			this.client.on(eName, (...args) => evt.invoke(...args));
			this.client.logger.log(`${eName} was loaded`, "event");
		}
	}
};