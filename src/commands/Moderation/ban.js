const CommandBase = require("../../base/CommandBase");
const { MessageEmbed, Message } = require("discord.js");


module.exports = class BanCommand extends CommandBase
{
	constructor(client)
	{
		super(client, {
			name: "ban",
			description: "Bans a member from the server.",
			category: "Moderation",
			enabled: true,
			guildOnly: true,
			usage: "ban <user> (reason)"
		});
	}
	/**
	 * 
	 * @param {Message} message 
	 * @param {String[]} args 
	 */
	async invoke(message, args)
	{
		let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
        let bReason = args.join(" ").slice(22);
		if(!bReason) bReason = "Unknown";
		if(!bUser) return message.channel.send("Can't find user.");
		if(!message.guild.me.hasPermission("BAN_MEMBERS")) return message.channel.send("I can't ban them, because I don't have the correct permission to do this. please make sure I have the permission of `Ban Members` on.");
		if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("You don't have permission to do this. You must have the permission of `Ban Member` enabled.");
		if(bUser.hasPermission("ADMINISTRATOR")) return message.channel.send("I can't ban someone that has `Administrator` permissions enabled.");
        let embed = new MessageEmbed()
        .setDescription("~Ban~")
        .setColor(0xea0000)
        .addField("Banned User", `${bUser} with ID: ${bUser.id}`)
        .addField("Banned By", `<@${message.author.username}> with ID: ${message.author.id}`)
        .addField("Banned In", message.channel)
        .addField("Time", message.createdAt)
        .addField("Reason", bReason);
		bUser.ban({reason: bReason});
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