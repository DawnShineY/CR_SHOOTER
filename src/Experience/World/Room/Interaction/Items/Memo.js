import * as THREE from 'three'
import Experience from '../../../../Experience.js'
import { CSS3DObject, CSS3DRenderer, OrbitControls } from 'three/examples/jsm/Addons.js'
import Interaction from '../Interaction.js'
import gsap from 'gsap'

export default class Memo
{
	constructor()
	{
		this.experience = new Experience()
		this.renderer = this.experience.renderer
		this.sizes = this.experience.sizes
		this.camera = this.experience.camera

		this.isRendering = false

		this.setCSS3DRenderer()
		this.setProfileCSS()
		this.switchControls()
		this.addAvatarEvent()

		this.interaction = new Interaction()
		this.pointer = this.interaction.pointer
		this.setPointerEvent()
		this.resetPointerEvent()
	}

	addAvatarEvent()
	{
		const avatarFrameElement = document.querySelector('.profile__avatar_frame')
		const avatarWrapElement = document.querySelector('.profile__avatar_wrap')
		const avatarElement = document.querySelector('.profile__avatar')

		const avatarWrapWidth = avatarWrapElement.clientWidth
		const avatarWrapHeight = avatarWrapElement.clientHeight

		avatarWrapElement.addEventListener('mousemove', (e) => {
			const avatarWrapRect = avatarWrapElement.getBoundingClientRect()
			const cursorX = e.clientX - avatarWrapRect.left
			const cursorY = e.clientY - avatarWrapRect.top

			const moveX = cursorX - avatarWrapWidth / 2
			const moveY = cursorY - avatarWrapHeight / 2

			//console.log(moveX, moveY)

			avatarElement.style.transform = `translate(${-moveX}px, ${-moveY}px) scale(2)`

		})
		avatarWrapElement.addEventListener('mouseout', () => {
			avatarElement.style.transition = 'transform 0.3s'
			avatarElement.style.transform = ''

		})

	}

	switchControls()
	{
		/**
		 * Scene control 동작 O
		 * CssRenderer Control 동작 X
		 */
		this.cssRenderer.domElement.style.pointerEvents = 'none'

		/**
		 * Scene control 동작 X
		 * CssRenderer Control 동작 O
		 */
		//this.camera.controls.domElement = this.cssRenderer.domElement
		//this.camera.controls.update()
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
		this.cssRenderer.domElement.style.opacity = 0
		document.body.appendChild(this.cssRenderer.domElement)
	}

	setProfileCSS()
	{
		this.cssScene = new THREE.Scene()
		//this.cssScene.visible = false
		this.cssScene.rotation.y = Math.PI * 0.25
		this.cssScene.position.set(0, 0, 0)

		const scaleParameter = 0.003
		this.cssScene.scale.set(scaleParameter, scaleParameter, scaleParameter)

		this.profileGroup = new THREE.Group()
		this.cssScene.add(this.profileGroup)
		this.profileGroup.rotation.x = - Math.PI * 0.25

		this.topGroup = new THREE.Group()
		this.bottomGroup = new THREE.Group()
		this.profileGroup.add(this.topGroup, this.bottomGroup)

		const profileTop = document.getElementById('profile_top')
		const profileBottom = document.getElementById('profile_bottom')

		this.profileTopObject = new CSS3DObject( profileTop )
		this.profileTopObject.position.y = 250

		this.topGroup.add( this.profileTopObject )
		this.topGroup.rotation.x = Math.PI * 0.9
		//topGroup.rotation.x = 0

		this.profileBottomObject = new CSS3DObject( profileBottom )
		this.profileBottomObject.position.y = -250

		this.bottomGroup.add( this.profileBottomObject )
		this.bottomGroup.rotation.x = - Math.PI * 0.1
	}
	resetPointerEvent()
	{
		this.pointer.on('reset', () =>
		{
			this.cssScene.visible = false
			this.isRendering = false
			gsap.to(
				this.cssRenderer.domElement.style,
				{
					opacity: 0,
					duration: 1,
				}
			)
			setTimeout(() =>
			{
				this.cssRenderer.domElement.style.display = 'none'
			}, 1000)
		})
	}

	setPointerEvent()
	{
		this.pointer.on('click', (obj) =>
		{
			if(obj === 'drawer')
			{
				this.cssRenderer.domElement.style.display = 'block'
				this.cssScene.visible = true
				this.isRendering = true
				gsap.to(this.camera.instance.position,
					{
						x: 17.94746799558896,
						y: 19.53944692395215,
						z: 17.726234541472923,
						duration: 1,
						delay: 3,
						ease: 'power2.inOut'
					}
				)
				gsap.to(this.camera.controls.target,
					{
						x: -0.36585217079070365,
						y: 0.6930266926821083,
						z: -0.3518681450786801,
						duration: 1,
						delay: 3,
						ease: 'power2.inOut'
					}
				)
				setTimeout(() =>
				{
					gsap.to(
						this.topGroup.rotation,
						{
							x: Math.PI * 0.1,
							duration: 1,
							//delay: 1,
							ease: 'power2.inOut'
						}
					)
					gsap.to(
						this.cssScene.position,
						{
							y: 1,
							duration: 1,
							//delay: 1,
							ease: 'power2.inOut'
						}
					)
					const scaleParameter = 0.005
					gsap.to(
						this.cssScene.scale,
						{
							x: scaleParameter,
							y: scaleParameter,
							z: scaleParameter,
							duration: 1,
							//delay: 1,
							ease: 'power2.inOut'
						}
					)
					gsap.to(
						this.cssRenderer.domElement.style,
						{
							opacity: 1,
							duration: 1,
						}
					)
				}, 4000)
			}
		})
	}

	resize()
	{
		this.cssRenderer.setSize(this.sizes.width, this.sizes.height)
	}

	update()
	{
		if(this.isRendering) this.cssRenderer.render(this.cssScene, this.camera.instance)
	}
}