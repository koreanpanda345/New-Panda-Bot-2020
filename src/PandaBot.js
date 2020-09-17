const { Client, Collection, ClientApplication } = require("discord.js");
const Enmap = require("enmap");
const CommandHandler = require("./handlers/CommandHandler");
const EventHandler = require("./handlers/EventHandler");
const Logger = require("./modules/Logger");

module.exports = class PandaBot extends Client
{
	constructor(options) 
	{
		super(options);
		this.commands = new Collection();
		/**
		 * @type {"online" | "idle" | "invisible" | "dnd"}
		 */
		this.status = "online";
		this.activity = {name: `${process.env.PREFIX}help | In ${this.guilds.cache.size} Servers`};
		this.logger = new Logger();
		/**
		 * @type {ClientApplication}
		 */
		this.appInfo = {};
		this.config = require("./config");
		this.settings = new Enmap({name: "settings", cloneLevel: "deep", fetchAll: false, autoFetch: true});
		this.userSettings = new Enmap({name: "userSettings", cloneLevel: "deep", fetchAll: false, autoFetch: true});
		const commandHandler = new CommandHandler(this);
		const eventHandler = new EventHandler(this);
		this.handlers = {command: commandHandler, event: eventHandler};
		this.wait = require("util").promisify(setTimeout);
	}
	/**
	 * 
	 * @param {string} text 
	 */
	async clean(text) 
	{
		if(text && text.constructor.name == "Promise")
			text = await text;
		if(typeof text !== "string")
			text = require("util").inspect(text, {depth: 1});

		text = text
			.replace(/`/g, "`" + String.fromCharCode(8203))
			.replace(/@/g, "@" + String.fromCharCode(8203))
			// eslint-disable-next-line no-undef
			.replace(process.env.DISCORD_TOKEN, "mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0")
			// eslint-disable-next-line no-undef
			.replace(process.env.TEST_TOKEN, "mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0");
	}
	/**
	 * 
	 * @param {String} userId 
	 */
	getUserSettings(userId)
	{
		return {
			...(this.config.defaultUserSettings || {}),
			...(this.userSettings.get(userId) || {})
		};
	}

	/**
	 * 
	 * @param {String} guildId 
	 */
	getSettings(guildId)
	{
		return {
			...(this.config.defaultSettings || {}),
			...(this.settings.get(guildId) || {})
		};
	}

	/**
	 * 
	 * @param {String} userId 
	 * @param {{}} newSettings 
	 */
	writeUserSettings(userId, newSettings)
	{
		const defaults = this.userSettings.get("default");
		let settings = this.userSettings.get(userId);
		if(typeof settings !== "object") settings = {};
		for(const key in newSettings)
		{
			if(defaults[key] !== newSettings[key])
				settings[key] = newSettings[key]
			else
				delete settings[key];
		}

		this.settings.set(userId, settings);
	}

	/**
	 * 
	 * @param {String} guildId 
	 * @param {{}} newSettings 
	 */
	writeSettings(guildId, newSettings)
	{
		const defaults = this.settings.get("default");
		let settings = this.settings.get(guildId);
		if(typeof settings !== "object") settings = {};
		for(const key in newSettings)
		{
			if(defaults[key] !== newSettings[key])
				settings[key] = newSettings[key];
			else
				delete settings[key];	
		}

		this.settings.set(guildId, settings);
	}

	/**
	 * 
	 * @param {Message} message 
	 * @param {any} question 
	 * @param {Number} limit 
	 */
	async awaitReply(message, question, limit = 60000)
	{
		const filter = m => m.author.id === message.author.id;
		await message.channel.send(question);
		try 
		{
			const collected = await message.channel.awaitMessages(filter, {max: 1, time: limit, errors: [ "time" ]});
			return collected.first().content;
		} 
		catch(error) 
		{
			return false;
		}
	}
};