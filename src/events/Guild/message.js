// eslint-disable-next-line no-unused-vars
const PandaBot = require("../../PandaBot");
// eslint-disable-next-line no-unused-vars
const { Message, MessageEmbed } = require("discord.js");
const translate = require("translate-google");

module.exports = class
{
	/**
	 * 
	 * @param {PandaBot} client 
	 */
	constructor(client)
	{
		this.client = client;
	}
	/**
	 * 
	 * @param {Message} message 
	 */
	async invoke(message)
	{
		if(message.author.bot) return;

		let settings;
		if(message.channel.type === "dm") settings = this.client.settings.get("default");
		else settings = this.client.getSettings(message.guild.id);
		message.settings = settings;

		if(message.mentions.members.size != 0)
		{
			let userSettings = this.client.getUserSettings(message.mentions.members.first().id);
			if(userSettings.turnOnLang === "true")
			{
				let args = message.content.split("<@!")[1].split(">")[1];

				translate(args, {to: userSettings.lang}).then(async res => {
					console.log(res);
					let embed = new MessageEmbed()
					.setTitle("Translation")
					.setDescription(res)
					.addField("Server", message.guild.name)
					.addField("User", message.author.username)
					.setTimestamp(message.createdAt)
					.setColor("RANDOM");
					(await message.mentions.members.first().createDM()).send(embed)
				}).catch(error => {
					console.error(error);
				})

			}
		}

		let userSettings = this.client.getUserSettings(message.author.id);
		if(userSettings.turnOnLang === "true")
		{
			if(!message.content.startsWith(settings.prefix))
			{
				if(settings.allowTranslations === "true")
				{
					translate(message.content, {from: userSettings.lang, to: settings.defaultLanguage}).then(async res => {
						console.log(res);
						let embed = new MessageEmbed()
						.setTitle("Translation")
						.setDescription(res)
						.setColor("RANDOM");
						message.channel.send(embed);
					}).catch(error => {
						console.error(error);
					})
	
				}
			}
		}

		if(message.guild && !message.channel.permissionsFor(message.guild.me).missing("SEND_MESSAGES")) return;


		const prefixMention = new RegExp(`<@!?${this.client.user.id}> ?$`);
		if(message.content.match(prefixMention)) return message.channel.send(`My Prefix for this server is ${settings.prefix}`);

		if(message.content.indexOf(settings.prefix) !== 0) return;

		const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
		const command = args.shift().toLowerCase();
		if(message.guild && !message.member) await message.guild.members.fetch(message.author);

		const cmd = this.client.commands.get(command) || this.client.commands.find(_cmd => _cmd.props.aliases && _cmd.props.aliases.includes(command));
		if(!cmd) return;
		if(!message.guild && cmd.props.guildOnly) return message.channel.send("This command only be use in a server.");

		try 
		{
			cmd.invoke(message, args);
		}
		catch(error)
		{
			let me = this.client.users.fetch("304446682081525772");
			(await me).dmChannel.send(error);
			console.error(error);
		}

	}
};