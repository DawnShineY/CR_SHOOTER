import * as THREE from 'three'
import Experience from '../../../../Experience.js'
import Interaction from '../Interaction.js'
import gsap from 'gsap'

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
		this.resetPointerEvent()

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
				gsap.to(
					this.model.rotation,
					{
						y: -Math.PI * 0.4,
						duration: 1,
						delay: 0.8,
						ease: 'power2.inOUt'
					}
				)

				return
			}
		})
	}

	resetPointerEvent()
	{
		this.pointer.on('reset', () =>
		{
			gsap.to(
				this.model.rotation,
				{
					y: 0,
					duration: 1,
					delay: 0,
					ease: 'power2.inOUt'
				}
			)
		})
	}
}