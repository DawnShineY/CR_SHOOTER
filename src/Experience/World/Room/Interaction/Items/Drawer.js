import * as THREE from 'three'
import Experience from '../../../../Experience.js'
import Interaction from '../Interaction.js'
import gsap from 'gsap'

export default class Drawer
{
	constructor(_interactionObjects)
	{
		this.interactionObjects = _interactionObjects
		this.model = this.interactionObjects.drawer

		this.experience = new Experience()
		this.debug = this.experience.debug

		this.interaction = new Interaction()
		this.pointer = this.interaction.pointer
		this.setPointerEvent()
		this.resetPointerEvent()

		if(this.debug.active) {
			this.debugFolder = this.debug.ui.addFolder('drawer')
			this.debugFolder.add(this.model.position, 'x').name('서랍').min(-3.4015002250671387).max(-2.8).step(0.01)
		}
	}

	setPointerEvent()
	{
		this.pointer.on('click', (obj) =>
		{
			if(obj === 'drawer')
			{
				gsap.to(
					this.model.position,
					{
						x: -2.8,
						duration: 1,
						delay: 0.8,
						ease: 'power2.inOut'
					}
				)
			}
		})
	}
	resetPointerEvent()
	{
		this.pointer.on('reset', (obj) =>
		{
			gsap.to(
				this.model.position,
				{
					x: -3.4015002250671387,
					duration: 1,
					delay: 0,
					ease: 'power2.inOut'
				}
			)
		})
	}
}