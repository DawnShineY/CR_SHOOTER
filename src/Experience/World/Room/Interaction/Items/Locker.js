import * as THREE from 'three'
import Experience from '../../../../Experience.js'

export default class Locker
{
	constructor(_interactionObjects)
	{
		this.interactionObjects = _interactionObjects
		this.model = this.interactionObjects.lockerDoor

		this.experience = new Experience()
		this.debug = this.experience.debug

		if(this.debug.active) {
			this.debugFolder = this.debug.ui.addFolder('락커문')
			this.debugFolder.add(this.model.rotation, 'y').min(-Math.PI * 0.4).max(0).step(0.01)
		}
	}
}