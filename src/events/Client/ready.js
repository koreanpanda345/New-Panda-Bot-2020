// eslint-disable-next-line no-unused-vars
const PandaBot = require("../../PandaBot");

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
	
	async invoke()
	{
		await this.client.wait(1000);
		this.client.appInfo = await this.client.fetchApplication();
		
		if(!this.client.settings.has("default"))
			this.client.settings.set("default", this.client.config.defaultSettings);

		setInterval(async () => 
		{
			this.client.appInfo = await this.client.fetchApplication();	
		}, 60000);

		this.client.logger.log(`${this.client.user.username} is ready`);

		this.client.user.setStatus(this.client.status);
		this.client.user.setActivity({name: this.client.activity.name});
	}
};