require("dotenv").config();

const PandaBot = require("./PandaBot");
const client = new PandaBot();
const testMode = true;
const init = () => 
{
	["Client", "Guild"].forEach(x => client.handlers.event.loadEvents(x));
	["Music", "Dev", "Miscellaneous", "Fun", "Moderation", "Info", "Reactions", "Language"].forEach(x => client.handlers.command.loadCommands(x));

	if(testMode)
		client.login(process.env.TEST_TOKEN);
	else
		client.login(process.env.DISCORD_TOKEN);
}

init();

String.prototype.toProperCase = function()
{
	return this.replace(/([^\W_]+[^\s-]*) */g, function(txt) 
	{ 
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
};

Array.prototype.random = function()
{
	return this[Math.floor(Math.random() * this.length)];
};

process.on("uncaughtException", (error) => 
{
	const errorMessage = error.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
	client.users.cache.get("304446682081525772").createDM().then(dm => {
		dm.send(`\`\`\`Uncaught Exception: ${errorMessage}\`\`\``);
	});
	console.error("Uncaught Exception: ", errorMessage);

	process.exit(1);
});

process.on("unhandledRejection", (error) =>
{
	client.users.cache.get("304446682081525772").createDM().then(dm => {
		dm.send(`\`\`\`Uncaught Promise Error: ${error}\`\`\``);
	});
	console.error("Uncaught Promise Error: ", error);
});