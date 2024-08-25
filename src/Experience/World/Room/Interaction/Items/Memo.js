import * as THREE from 'three'
import Experience from '../../../../Experience.js'
import { CSS3DObject, CSS3DRenderer, OrbitControls } from 'three/examples/jsm/Addons.js'

export default class Memo
{
	constructor()
	{
		this.experience = new Experience()
		this.renderer = this.experience.renderer
		this.sizes = this.experience.sizes
		this.camera = this.experience.camera

		this.setCSS3DRenderer()
		this.setProfileCSS()
		this.switchControls()
		this.addEvent()
	}

	addEvent()
	{
		const avatarFrameElement = document.querySelector('.profile__avatar_frame')
		const avatarWrapElement = document.querySelector('.profile__avatar_wrap')
		const avatarElement = document.querySelector('.profile__avatar')

		let scaleEnd = false
		avatarFrameElement.addEventListener('mousemove', (e) =>
		{
			const scaleFactor = 2
			let x = ( - e.offsetX + 225 / 2 ) * 0.5 * scaleFactor
			let y = ( - e.offsetY + 278 / 2 ) * 0.5 * scaleFactor

			avatarElement.style.transform = `scale(${scaleFactor})`

			if(scaleEnd)
			{
				avatarWrapElement.style.transform = `translate(${x}px, ${y}px)`
			}
		})
		avatarFrameElement.addEventListener('mouseout', (e) =>
		{
			scaleEnd = false
			avatarWrapElement.style.transform = 'none'
			avatarElement.style.transform = 'none'
		})
		avatarFrameElement.addEventListener('mouseover', (e) =>
		{
			scaleEnd = false
		})

		avatarElement.addEventListener('transitionend', () =>
		{
			scaleEnd = true
		})
	}

	switchControls()
	{
		//this.camera.controls.domElement = this.cssRenderer.domElement
		//this.camera.controls.update()
		this.cssRenderer.domElement.style.pointerEvents = 'none'
		//this.camera.controls
		//this.camera.controls = new OrbitControls(this.camera.instance, this.cssRenderer.domElement)
		//this.camera.controls.enableDamping = true
	}
	setCSS3DRenderer()
	{
		this.cssRenderer = new CSS3DRenderer()
		this.cssRenderer.setSize(this.sizes.width, this.sizes.height)
		this.cssRenderer.domElement.style.position = 'fixed'
		this.cssRenderer.domElement.style.top = 0
		this.cssRenderer.domElement.style.zIndex = 1
		//this.cssRenderer.domElement.style.pointerEvents = 'none'
		document.body.appendChild(this.cssRenderer.domElement)
	}

	setProfileCSS()
	{
		this.cssScene = new THREE.Scene()
		this.cssScene.rotation.y = Math.PI * 0.25
		this.cssScene.position.set(0, 1, 0)

		const scaleParameter = 0.005
		this.cssScene.scale.set(scaleParameter, scaleParameter, scaleParameter)

		const profileGroup = new THREE.Group()
		this.cssScene.add(profileGroup)
		profileGroup.rotation.x = - Math.PI * 0.25

		const topGroup = new THREE.Group()
		const bottomGroup = new THREE.Group()
		profileGroup.add(topGroup, bottomGroup)

		const profileTop = document.getElementById('profile_top')
		const profileBottom = document.getElementById('profile_bottom')

		const profileTopObject = new CSS3DObject( profileTop )
		profileTopObject.position.y = 250

		topGroup.add( profileTopObject )
		topGroup.rotation.x = Math.PI * 0.1

		const profileBottomObject = new CSS3DObject( profileBottom )
		profileBottomObject.position.y = -250

		bottomGroup.add( profileBottomObject )
		bottomGroup.rotation.x = - Math.PI * 0.1
	}

	resize()
	{
		this.cssRenderer.setSize(this.sizes.width, this.sizes.height)
	}

	update()
	{
		this.cssRenderer.render(this.cssScene, this.camera.instance)
	}
}