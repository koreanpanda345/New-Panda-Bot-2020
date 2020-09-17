/* eslint-disable no-unused-vars */
const CommandBase = require("../../base/CommandBase");
const { Message } = require("discord.js");
module.exports = class TurnLangCommand extends CommandBase
{
	constructor(client)
	{
		super(client, {
			name: "turnlang",
			description: "turns on/off your personal translator.",
			category: "Language",
			enabled: true,
			guildOnly: false
		});
	}	
	/**
	 * 
	 * @param {Message} message 
	 * @param {String[]} args 
	 */
	async invoke(message, args)
	{
		if(this.client.getUserSettings(message.author.id).turnOnLang === "true")
		{
			let settings = this.client.getUserSettings(message.author.id);
			settings.turnOnLang = "false";
			this.client.userSettings.set(message.author.id, settings);
		}
		else
		{
			let settings = this.client.getUserSettings(message.author.id);
			settings.turnOnLang = "true";
			this.client.userSettings.set(message.author.id, settings);
		}
		message.channel.send(`Ok, I have turn ${this.client.getUserSettings(message.author.id).turnOnLang === "true" ? "`On`" : "`Off`"} your personal translator.`);


	}
};