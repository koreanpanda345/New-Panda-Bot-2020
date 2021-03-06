/* eslint-disable no-unused-vars */
const CommandBase = require("../../base/CommandBase");
const { Message, MessageEmbed } = require("discord.js");
const superagent = require("superagent");
module.exports = class KissCommand extends CommandBase
{
	constructor(client)
	{
		super(client, {
			name: "kiss",
			description: "you want to kiss your love one, don't you -w-",
			category: "Reactions",
			enabled: true,
			guildOnly: true
		});
	}	
	/**
	 * 
	 * @param {Message} message 
	 * @param {String[]} args 
	 */
	async invoke(message, args)
	{
        let {body} = await superagent.get(`https://nekos.life/api/v2/img/kiss`);
        let hUser = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
        if(!hUser) return message.channel.send("Please enter a vaild user");
      
        let kissEmbed = new MessageEmbed()
        .setDescription(`${message.author} kisses ${hUser} ^\/\/\/\/\/\/\/^`)
        .setColor("RANDOM")
        .setImage(body.url);
      
        message.channel.send(kissEmbed);
	}
};