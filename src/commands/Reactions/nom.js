/* eslint-disable no-unused-vars */
const CommandBase = require("../../base/CommandBase");
const { Message, MessageEmbed } = require("discord.js");
const superagent = require("superagent");
module.exports = class NomCommand extends CommandBase
{
	constructor(client)
	{
		super(client, {
			name: "nom",
			description: "want to eat someone, Can I help? OWO",
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
        let {body} = await superagent.get(`https://nekos.life/api/v2/img/feed`);
        let hUser = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
        if(!hUser) return message.channel.send("Please enter a vaild user");
      
        let kissEmbed = new MessageEmbed()
        .setDescription(`${message.author} noms ${hUser} OWO`)
        .setColor("RANDOM")
        .setImage(body.url);
      
        message.channel.send(kissEmbed);
	}
};