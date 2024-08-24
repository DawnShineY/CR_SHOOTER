import * as THREE from 'three'
import Experience from '../../../../Experience.js'

export default class Windbell
{
	constructor(_interactionObjects)
	{
		this.experience = new Experience()
		this.time = this.experience.time
		this.interactionObjects = _interactionObjects
		this.windBellGroup = this.interactionObjects.windBellGroup

		this.setRotationSpeed()
	}

	setRotationSpeed()
	{
		this.windBellGroup.windBell01.rotationSpeed = Math.random() * 0.2
		this.windBellGroup.windBell02.rotationSpeed = Math.random() * 0.2
		this.windBellGroup.windBell03.rotationSpeed = Math.random() * 0.22
	}

	update()
	{
		for(let key in this.windBellGroup)
		{
			const windbell = this.windBellGroup[ key ]
			windbell.rotation.y = Math.sin(this.time.elapsed * windbell.rotationSpeed * 0.01) * 0.5
		}
	}

}