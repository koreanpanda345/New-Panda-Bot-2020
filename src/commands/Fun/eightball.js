const CommandBase = require("../../base/CommandBase");
const { Message, MessageEmbed } = require("discord.js");


module.exports = class EightBallCommand extends CommandBase
{
	constructor(client)
	{
		super(client, {
			name: "8ball",
			aliases: ["eightball"],
			description: "Ask the magic 8ball.",
			enabled: true,
			guildOnly: true,
			usage: "8ball <question>",
			category: "Fun"
		});
	}
	/**
	 * 
	 * @param {Message} message 
	 * @param {String[]} args 
	 */
	async invoke(message, args) 
	{
		let replies = ["Yes.", "No.", "I don't know", "Ask again later"];
        let result = Math.floor((Math.random() * replies.length));
        let question = args.slice(0).join(" ");
        let embed = new MessageEmbed();
        embed.setAuthor(message.author.tag);
        embed.setColor("RANDOm");
        embed.addField('Question', question);
        embed.addField('Answer', replies[result]);
        message.channel.send(embed);
	}
};