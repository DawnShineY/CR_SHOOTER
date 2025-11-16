import Experience from "@/Experience/Experience.js";
import Environment from "./Environment.js";
import Room from "./Room/Room.js";

export default class World
{
	constructor()
	{
		this.experience = new Experience()
		this.resources = this.experience.resources

		this.resources.on('ready', () =>
		{
			this.environment = new Environment()
			this.room = new Room()
		})
	}
	update()
	{
		if(this.room)
		{
			this.room.update()
		}
	}
	resize()
	{
		if(this.room)
		{
			this.room.resize()
		}
	}
}