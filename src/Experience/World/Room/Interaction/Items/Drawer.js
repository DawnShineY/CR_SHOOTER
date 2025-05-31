import * as THREE from 'three'
import Experience from '../../../../Experience.js'

export default class Drawer
{
	constructor(_interactionObjects)
	{
		this.interactionObjects = _interactionObjects
		this.model = this.interactionObjects.drawer

		this.experience = new Experience()
		this.debug = this.experience.debug

		if(this.debug.active) {
			this.debugFolder = this.debug.ui.addFolder('drawer')
			this.debugFolder.add(this.model.position, 'x').name('서랍').min(-3.4015002250671387).max(-2.8).step(0.01)
		}
	}
}