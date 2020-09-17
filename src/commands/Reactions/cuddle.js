/* eslint-disable no-unused-vars */
const CommandBase = require("../../base/CommandBase");
const { Message, MessageEmbed } = require("discord.js");
const superagent = require("superagent");
module.exports = class CuddleCommand extends CommandBase
{
	constructor(client)
	{
		super(client, {
			name: "cuddle",
			description: "AWWW you two look prefect together!",
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
        let {body} = await superagent.get(`https://nekos.life/api/v2/img/cuddle`);
        let cUser = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
        if(!cUser) return message.channel.send("Please enter a vaild user");
      
        let cuddleEmbed = new MessageEmbed()
        .setDescription(`${message.author} cuddles ${cUser} ^\/\/\/\/\/\/\/^`)
        .setColor("RANDOM")
        .setImage(body.url);
      
        message.channel.send(cuddleEmbed);
	}
};