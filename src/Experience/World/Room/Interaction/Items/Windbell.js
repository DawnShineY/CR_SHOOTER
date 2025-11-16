import Experience from '@/Experience/Experience.js'

export default class Windbell
{
	constructor(_interactionObjects)
	{
		this.interactionObjects = _interactionObjects
		this.model = this.interactionObjects.windBellGroup

		this.experience = new Experience()
		this.time = this.experience.time

		this.setRotationSpeed()
	}

	setRotationSpeed()
	{
		this.model.windBell01.rotationSpeed = Math.random() * 4
		this.model.windBell02.rotationSpeed = Math.random() * 4
		this.model.windBell03.rotationSpeed = Math.random() * 4
	}

	update()
	{
		for(let key in this.model)
		{
			const windbell = this.model[ key ]
			windbell.rotation.y = Math.sin( this.time.elapsed * windbell.rotationSpeed ) * 0.5
		}
	}

}