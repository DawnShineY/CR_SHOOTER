import { MeshBasicMaterial } from 'three'
import Experience from '@/Experience/Experience.js'
import Interaction from '../Interaction.js'
import gsap from 'gsap'

export default class Gun
{
	constructor(_interactionObjects)
	{
		this.interactionObjects = _interactionObjects
		this.model = this.interactionObjects.gun
		this.modelShadow = this.interactionObjects.gunShadow
		this.modelOriginPosition = {...this.model.position}
		this.modelOriginRotation = {
			x: this.model.rotation.x,
			y: this.model.rotation.y,
			z: this.model.rotation.z,
		}

		this.experience = new Experience()
		this.resources = this.experience.resources
		this.debug = this.experience.debug

		this.interaction = new Interaction()
		this.pointer = this.interaction.pointer
		this.setPointerEvent()

		if(this.debug.active) {
			this.debugFolder = this.debug.ui.addFolder('gun')
			this.debugFolder.add(this.model.position, 'x').name('총 x').min(1.4246635437011719).max(100).step(0.01)
			this.debugFolder.add(this.model.position, 'y').name('총 y').min(1.856541633605957).max(100).step(0.01)
			this.debugFolder.add(this.model.position, 'z').name('총 z').min(0.1796553134918213).max(100).step(0.01)
			this.debugFolder.add(this.model.rotation, 'x').name('총 회전 x').min(-Math.PI * 2).max(Math.PI * 2).step(0.01)
			this.debugFolder.add(this.model.rotation, 'y').name('총 회전 y').min(-Math.PI * 2).max(Math.PI * 2).step(0.01)
			this.debugFolder.add(this.model.rotation, 'z').name('총 회전 z').min(-Math.PI * 2).max(Math.PI * 2).step(0.01)
			}

		this.setShadow()
	}

	setPointerEvent()
	{
		this.pointer.on('click', (obj) =>
		{
			if(obj === 'gun')
			{
				this.startMission()
			}
		})
	}
	startMission()
	{
		gsap.to(
		this.model.position,
		{
			x: 26,
			y: 20.38,
			z: 26,
			duration: 2,
			ease: 'power2.inOut'
		}
		)
		gsap.to(
		this.model.rotation,
		{
			y: 2.18,
			z: -0.4,
			duration: 1,
			ease: 'power2.inOut'
		}
		)
		this.modelShadow.visible = false
		setTimeout(() =>
		{
		this.model.visible = false
		}, 2000)
	}
	setShadow()
	{
		this.shadowOpacityTexture = this.resources.items.gunShadowOpacityTexture
		this.shadowOpacityTexture.flipY = false

		this.modelShadow.material = new MeshBasicMaterial({
			color: '#000000',
			transparent: true,
			alphaMap: this.shadowOpacityTexture
		})
	}
}