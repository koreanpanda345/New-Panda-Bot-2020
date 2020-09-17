/* eslint-disable no-unused-vars */
const CommandBase = require("../../base/CommandBase");
const { Message, MessageEmbed } = require("discord.js");
const {handleVideo, queue, youtube} = require("../../handlers/MusicHandler");
module.exports = class StopCommand extends CommandBase
{
	constructor(client)
	{
		super(client, {
			name: "stop",
			aliases: ["st"],
			description: "Stop your queue and leaves.",
			category: "Music",
			enabled: true,
			guildOnly: true,
			usage: "stop"
		});
	}	
	/**
	 * 
	 * @param {Message} message 
	 * @param {String[]} args 
	 */
	async invoke(message, args)
	{
		const serverQueue = queue.get(message.guild.id);
        if(!message.member.voice.channel) return message.channel.send('Your not in a voice channel!');
        if(!serverQueue) return message.channel.send("There is nothing playing that i could stop for you");
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end('Stop cmd has been used!');
        message.channel.send(`Successfully stop the queuing and left the voice channel.`)
        return undefined;
	}
};