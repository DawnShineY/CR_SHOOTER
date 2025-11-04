import * as THREE from 'three'
import Experience from '../../../../Experience.js'
import { CSS3DObject, CSS3DRenderer, LineMaterial, OrbitControls, Wireframe, WireframeGeometry2 } from 'three/examples/jsm/Addons.js'
import gsap from 'gsap'
import Interaction from '../Interaction.js'

export default class Memo
{
	constructor(_interactionObjects)
	{
		this.interactionObjects = _interactionObjects
		this.model = this.interactionObjects.memo

		this.experience = new Experience()
		this.renderer = this.experience.renderer
		this.sizes = this.experience.sizes
		this.camera = this.experience.camera
		this.canvas = this.experience.canvas
		this.raycaster = this.experience.raycaster
		this.modelGroup = this.experience.scene.modelGroup
		this.scene = this.experience.scene.instance

		this.isRendering = false
		this.isFirstRendering = true
		this.isDrawerOpened = false

		this.interaction = new Interaction()
		this.pointer = this.interaction.pointer
		this.pointer.on('click', (obj) =>
		{
			if(obj === 'drawer')
			{
				this.isDrawerOpened = true
			}
		})

		this.pointer.on('reset', ()=>{
			this.isDrawerOpened = false
		})

		/**
		 * 이력서
		 */
		this.setCSS3DRenderer()
		//this.setOrbitControls()
		this.setProfileCSS()
		this.addAvatarEvent()
		this.clickEvent = this.setClickEvent.bind(this)

		/**
		 * 메모 종이
		 */
		this.prevMouseIn = false

	}

	/**
	 * 메모 종이
	 */
	updateRaycaster()
	{
		const intersection = this.raycaster.instance.intersectObject( this.model )

		if(intersection.length > 0)
		{
			if(!this.prevMouseIn)
			{
				this.canvas.addEventListener( 'click', this.clickEvent )
				this.canvas.style.cursor = 'pointer'
			}
			this.prevMouseIn = true
		}
		else
		{
			if(this.prevMouseIn)
			{
				this.canvas.removeEventListener( 'click', this.clickEvent )
				this.canvas.style.cursor = 'default'
			}
			this.prevMouseIn = false
		}
	}


	/**
	 * 이력서
	 */
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

	setOrbitControls()
	{
		this.camera.controls.enabled = false
		//this.cssRendererControls = new OrbitControls( this.camera.instance, this.cssRenderer.domElement )
		//this.cssRendererControls.enableDamping = true
	}
	setCSS3DRenderer()
	{
		this.cssRenderer = new CSS3DRenderer()
		this.cssRenderer.setSize(this.sizes.width, this.sizes.height)
		this.cssRenderer.domElement.style.position = 'fixed'
		this.cssRenderer.domElement.style.top = 0
		this.cssRenderer.domElement.style.zIndex = 1
		this.cssRenderer.domElement.style.opacity = 0
		this.cssRenderer.domElement.style.pointerEvents = 'none'
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

	setCloseEvent()
	{
		const clsBtnElement = document.querySelector('#profileClsBtn')
		console.log(clsBtnElement)
		clsBtnElement.addEventListener('click', () =>
		{
			gsap.to(
				this.topGroup.rotation,
				{
					x: Math.PI * 0.9,
					duration: 1,
					//delay: 1,
					ease: 'power2.inOut'
				}
			)
			gsap.to(
				this.cssScene.position,
				{
					y: 0.5,
					duration: 1,
					//delay: 1,
					ease: 'power2.inOut'
				}
			)
			const scaleParameter = 0.003
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
					opacity: 0,
					duration: 1,
				}
			)
			this.camera.controls.enabled = true
			this.cssRenderer.domElement.style.pointerEvents = 'none'
			setTimeout(() =>
			{
				this.isRendering = false
				this.cssScene.visible = false
				this.cssRenderer.domElement.style.display = 'none'
			}, 1000)
		})


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

	setClickEvent()
	{
		if(this.isFirstRendering)
		{
			document.body.appendChild(this.cssRenderer.domElement)
			this.setOrbitControls()
			this.setCloseEvent()
		}
		this.isFirstRendering = false
		this.isRendering = true
		this.cssRenderer.domElement.style.pointerEvents = 'auto'
		this.cssRenderer.domElement.style.display = 'block'
		this.cssScene.visible = true
		gsap.to(this.camera.instance.position,
			{
				x: 17.94746799558896,
				y: 19.53944692395215,
				z: 17.726234541472923,
				duration: 1,
				delay: 0,
				ease: 'power2.inOut'
			}
		)
		gsap.to(this.camera.controls.target,
			{
				x: -0.36585217079070365,
				y: 0.6930266926821083,
				z: -0.3518681450786801,
				duration: 1,
				delay: 0,
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
		}, 1000)
	}

	resize()
	{
		this.cssRenderer.setSize(this.sizes.width, this.sizes.height)
	}

	update()
	{
		if(this.isDrawerOpened) this.updateRaycaster()
		if(this.isRendering)
		{
			this.cssRenderer.render(this.cssScene, this.camera.instance)
			//this.cssRendererControls.update()
		}
	}
}