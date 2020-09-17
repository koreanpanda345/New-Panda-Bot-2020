const CommandBase = require("../../base/CommandBase");
const { Message, MessageEmbed } = require("discord.js");


module.exports = class InfoCommand extends CommandBase
{
	constructor(client)
	{
		super(client, {
			name: "info",
			aliases: ["botinfo", "bot"],
			usage: "info",
			category: "Info",
			description: "Displays info about me.",
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
		let embed = new MessageEmbed()
		.addField("Panda Bot", "This is Panda Bot, Design to make people love pandas (^-^). And Panda Bot knows all, nothing can outmatch him.", true)
		.addField("Creator", "Koreanpanda345#2878", true)
		.setColor("RANDOM")
		.setFooter("GIVE ME BAMBOO")
		.addField("Created On", message.client.user.createdAt);

		message.channel.send(embed);
	}
};