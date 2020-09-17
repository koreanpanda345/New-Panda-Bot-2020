const ytdl = require("ytdl-core");
const Youtube = require("simple-youtube-api");
const youtube = new Youtube(process.env.YT_API_KEY);
var Stopwatch = require("stopwatch-emitter").Stopwatch;
const { Util, Message, VoiceChannel, TextChannel, VoiceConnection, MessageEmbed } = require("discord.js");
const Video = require("simple-youtube-api/src/structures/Video");


/**
 * @typedef {{id: any, title: string, url: string, channel: string, durationm: number, durations: number, durationh: number}} SongType
 * @typedef {{textChannel: TextChannel, voiceChannel: VoiceChannel, connection: VoiceConnection, songs: SongType[], volumn: Number, playing: boolean}} ServerQueueType
 */
/**
 * @type {Map<string, ServerQueueType>}
 */
 const queue = new Map();

 /**
 * 
 * @param {Video} video 
 * @param {Message} message 
 * @param {VoiceChannel} voiceChannel 
 * @param {boolean} playlist 
 */
async function handleVideo(video, message, voiceChannel, playlist = false)
{
	/**
	 * @type {ServerQueueType}
	 */
	const serverQueue = queue.get(message.guild.id);
	console.log(video);
	const song = {
		id: video.id,
		title: Util.escapeMarkdown(video.title),
		url: `https://www.youtube.com/watch?v=${video.id}`,
		channel: video.channel.title,
		durationm: video.duration.minutes,
		durations: video.duration.seconds,
		durationh: video.duration.hours
	};

	if(!serverQueue)
	{
		const queueConstruct = {
			textChannel: message.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true
		};

		queue.set(message.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try 
		{
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(message.guild, queueConstruct.songs[0]);
		} catch(error)
		{
			console.error(`I could not join the voice channel: ${error}`);
			queue.delete(message.guild.id);
			return message.channel.send(`I could not join the voice channel: ${error}`);
		}
	}
	else
	{
		serverQueue.songs.push(song);
		let songAddedEmbed = new MessageEmbed()
		.setTitle(`${song.title} has been added to the queue`)
		.setColor(`0xff3262`)
		.addField(`Publisher: `, `${song.channel}`, true)
		.addField('Video ID: ', song.id, true)
		.addField(`Duration: `, `**${song.durationh}** hours: **${song.durationm}** minutes: **${song.durations}** seconds`)
		.setThumbnail(`https://i.ytimg.com/vi/${song.id}/sddefault.jpg`)
		.setDescription(`[${song.title}](https://www.youtube.com/watch?v=${song.id}})`)
		if (playlist) return undefined;
 
		else return message.channel.send(songAddedEmbed);
	}
	return undefined;
}    
play = function( guild, song){
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}
	console.log(serverQueue.songs);

	const dispatcher = serverQueue.connection.play(ytdl(song.url))
		.on("finish", reason => {
			if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
			else console.log(reason);
	  serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	setTimeout(function(){
		let durationTime = (((song.durationh / 60) + (song.durationm)) / 60) + song.durations
		var stopwatch = new Stopwatch(durationTime);
		stopwatch.getRemainingTime();
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
	let songEmbed = new MessageEmbed()
	.setColor(`0xff3262`)
	.addField(`Publisher: `, `${song.channel}`, true)
	.addField('Video ID: ', song.id, true)
	.addField(`Duration: `, `**${song.durationh}** hours: **${song.durationm}** minutes: **${song.durations}** seconds`)
	.setThumbnail(`https://i.ytimg.com/vi/${song.id}/sddefault.jpg`)
	.setDescription(`[${song.title}](https://www.youtube.com/watch?v=${song.id}})`)
   
	serverQueue.textChannel.send(songEmbed);
}, 500);
}

module.exports = {handleVideo, queue, youtube};