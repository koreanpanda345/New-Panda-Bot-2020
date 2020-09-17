/* eslint-disable no-unused-vars */
const CommandBase = require("../../base/CommandBase");
const { Message, MessageEmbed } = require("discord.js");
const superagent = require("superagent");
module.exports = class HugCommand extends CommandBase
{
	constructor(client)
	{
		super(client, {
			name: "hug",
			description: "Awwww you want to hug someone?",
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
        let {body} = await superagent.get(`https://nekos.life/api/v2/img/hug`);
        let hUser = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
        if(!hUser) return message.channel.send("Please enter a vaild user");
      
        let hugEmbed = new MessageEmbed()
        .setDescription(`${message.author} hugs ${hUser} ^\/\/\/\/\/\/\/^`)
        .setColor("RANDOM")
        .setImage(body.url);
      
        message.channel.send(hugEmbed);
	}
};