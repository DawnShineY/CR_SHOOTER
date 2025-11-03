import * as THREE from 'three'
import Experience from '../../../../Experience.js'
import Interaction from '../Interaction.js'

export default class Gun
{
	constructor(_interactionObjects)
	{
		this.interactionObjects = _interactionObjects
		this.model = this.interactionObjects.gun
		this.modelShadow = this.interactionObjects.gunShadow

		this.experience = new Experience()
		this.resources = this.experience.resources
		this.debug = this.experience.debug

		this.interaction = new Interaction()
		this.pointer = this.interaction.pointer
		this.setPointerEvent()

		if(this.debug.active) {
			this.debugFolder = this.debug.ui.addFolder('gun')
			this.debugFolder.add(this.model.position, 'x').name('총 x').min(1.4246635437011719).max(10).step(0.01)
			this.debugFolder.add(this.model.position, 'y').name('총 y').min(1.856541633605957).max(10).step(0.01)
			this.debugFolder.add(this.model.position, 'z').name('총 z').min(0.1796553134918213).max(10).step(0.01)
			this.debugFolder.add(this.model.rotation, 'y').name('총 회전').min(0).max(Math.PI * 2).step(0.01)
			}

		this.setShadow()
	}

	setPointerEvent()
	{
		this.pointer.on('click', (obj) =>
		{
			if(obj === 'gun')
			{
				console.log('this is gun')
			}
		})
	}

	setShadow()
	{
		this.shadowOpacityTexture = this.resources.items.gunShadowOpacityTexture
		this.shadowOpacityTexture.flipY = false

		this.modelShadow.material = new THREE.MeshBasicMaterial({
			color: '#000000',
			transparent: true,
			alphaMap: this.shadowOpacityTexture
		})
	}
}