import * as THREE from 'three'
import Experience from '../../../../Experience.js'
import Interaction from '../Interaction.js'

export default class Locker
{
	constructor(_interactionObjects)
	{
		this.interactionObjects = _interactionObjects
		this.model = this.interactionObjects.lockerDoor

		this.experience = new Experience()
		this.debug = this.experience.debug

		this.interaction = new Interaction()
		this.pointer = this.interaction.pointer
		this.setPointerEvent()

		if(this.debug.active) {
			this.debugFolder = this.debug.ui.addFolder('락커문')
			this.debugFolder.add(this.model.rotation, 'y').min(-Math.PI * 0.4).max(0).step(0.01)
		}
	}

	setPointerEvent()
	{
		this.pointer.on('click', (obj) =>
		{
			if(obj === 'lockerDoor')
			{
				console.log('this is lockerDoor')

				return
			}
		})
	}
}