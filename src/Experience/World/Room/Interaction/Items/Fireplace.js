import * as THREE from 'three'
import Experience from '../../../../Experience.js'
import Interaction from '../Interaction.js'
import gsap from 'gsap'

export default class Fireplace
{
	constructor(_interactionObjects)
	{
		this.interactionObjects = _interactionObjects
		this.group = this.interactionObjects.lightsPositionGroup
		this.fireplacePosition = this.group.fireplacePosition.position

		this.experience = new Experience()
		this.modelGroup = this.experience.scene.modelGroup

		this.setFire()

		this.interaction = new Interaction()
		this.pointer = this.interaction.pointer
		this.setPointerEvent()
		this.resetPointerEvent()
	}

	setPointerEvent()
	{
		this.pointer.on('click', (obj) =>
		{
			if(obj === 'fireplace')
			{
				this.fireplaceLight.visible = true
				gsap.to(
				this.fireplaceLight,
				{
					intensity: 10,
					duration: 1,
				}
			)
			}
		})
	}
	resetPointerEvent()
	{
		this.pointer.on('reset', () =>
		{
			gsap.to(
				this.fireplaceLight,
				{
					intensity: 0,
					duration: 1,
					onComplete: () =>
					{
						this.fireplaceLight.visible = false
					}
				}
			)
		})
	}

	setFire()
	{
		this.fireplaceLight = new THREE.PointLight('#c21e1e', 0, 1, 1)
		this.fireplaceLight.position.copy(this.fireplacePosition)
		this.fireplaceLight.visible = false
		this.modelGroup.add( this.fireplaceLight )
	}

}