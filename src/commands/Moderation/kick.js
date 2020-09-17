const CommandBase = require("../../base/CommandBase");
const { Message, MessageEmbed } = require("discord.js");


module.exports = class KickCommand extends CommandBase
{
	constructor(client)
	{
		super(client, {
			name: "kick",
			description: "Kicks a member from the server.",
			category: "Moderation",
			usage: "kick <@who> (reason)",
			enabled: true,
			guildOnly: true,
		});
	}
	/**
	 * 
	 * @param {Message} message 
	 * @param {String[]} args 
	 */
	async invoke(message, args)
	{
		let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
        if(!kUser) return message.channel.send("Can't find user!");
        let kReason = args.join(" ").slice(22);
        if(!message.guild.me.hasPermission("KICK_MEMBERS")) return message.reply("Sorry, but I don't have permission to do this. I must have `Kick Members` permission enabled to do this.");
		if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("Sorry, but you don't have permission to do this. You need to have `Kick Members` permissions enabled to do this.")
		if(kUser.hasPermission("ADMINISTRATOR")) return message.channel.send("Sorry, but I can't kick someone that has `Administrator` permissions.")
		if(!kReason) kReason = "No Reason was provided.";
		let embed = new MessageEmbed()
        .setDescription("~Kick~")
        .setColor("0xf20e0e")
        .addField("Kicked User", `${kUser}`)
        .addField("Kicked By", `<@${message.author.id}>`)
        .addField("Kicked In", message.channel)
        .addField("Time", message.createdAt)
        .addField("Reason", kReason);
      
        kUser.kick(kReason);
		if(this.client.getSettings(message.guild.id).sendModerationToChannel)
		{
			let channel = message.guild.channels.cache.get(this.client.getSettings(message.guild.id).moderationChannel);
			if(!channel)
			{
				message.channel.send(`${this.client.getSettings(message.guild.id).moderationChannel} doesn't seem to exist in the server.`);
				message.channel.send(embed);
			} 
			else return channel.send(embed);
		}
		else return message.channel.send(embed);
	}
};