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
		this.prevMouseIn = false

		/**
		 * 메모 종이
		 */
		this.checkDrawerOpen()

		/**
		 * 이력서
		 */
		this.setProfileCSS()
		this.addAvatarEvent()
		this.css3dRenderingEvent = this.setOpenProfileMemo.bind(this)
		this.mouseMoveEvent = this.setMouseMoveEvent.bind(this)
	}

	/**
	 * 메모 종이
	 */
	checkDrawerOpen()
	{
		this.interaction = new Interaction()
		this.pointer = this.interaction.pointer
		this.modelRotationTimeLine = gsap.to(
			this.model.rotation,
			{
				y: 0.15,
				duration: 1,
				//ease: 'power2.inOut',
				repeat: -1,
				yoyo: true,
				yoyoEase: 'power2.inOut'
			}
		).pause()

		this.pointer.on('click', (obj) =>
		{
			if(obj === 'drawer')
			{
				this.isDrawerOpened = true
				this.modelRotationTimeLine.play()
			}
		})

		this.pointer.on('reset', ()=>{
			this.isDrawerOpened = false
			this.modelRotationTimeLine.pause()

		})
	}

	updateRaycaster()
	{
		const intersection = this.raycaster.instance.intersectObject( this.model )

		if(intersection.length > 0)
		{
			if(!this.prevMouseIn)
			{
				this.canvas.addEventListener( 'click', this.css3dRenderingEvent )
				this.canvas.style.cursor = 'pointer'
			}
			this.prevMouseIn = true
		}
		else
		{
			if(this.prevMouseIn)
			{
				this.canvas.removeEventListener( 'click', this.css3dRenderingEvent )
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

	setCSS3DRenderer()
	{
		this.cssRenderer = new CSS3DRenderer()
		this.cssRenderer.setSize(this.sizes.width, this.sizes.height)
		this.cssCanvas = this.cssRenderer.domElement
		this.cssCanvas.style.position = 'fixed'
		this.cssCanvas.style.top = 0
		this.cssCanvas.style.zIndex = 1
		this.cssCanvas.style.opacity = 0
		this.cssCanvas.style.pointerEvents = 'none'
		document.body.appendChild(this.cssCanvas)
	}

	setProfileCSS()
	{
		this.cssScene = new THREE.Scene()
		this.cssScene.position.set(0, 0, 0)

		const qx = new THREE.Quaternion();
		const qy = new THREE.Quaternion();
		qx.setFromAxisAngle(new THREE.Vector3(1, 0, 0), - Math.PI * 0.25);
		qy.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 0.25);
		this.cssScene.quaternion.multiplyQuaternions(qy, qx);

		const scaleParameter = 0.003
		this.cssScene.scale.set(scaleParameter, scaleParameter, scaleParameter)

		this.profileGroup = new THREE.Group()
		this.cssScene.add(this.profileGroup)

		this.topGroup = new THREE.Group()
		this.bottomGroup = new THREE.Group()
		this.profileGroup.add(this.topGroup, this.bottomGroup)

		const profileTop = document.getElementById('profile_top')
		const profileBottom = document.getElementById('profile_bottom')

		this.profileTopObject = new CSS3DObject( profileTop )
		this.profileTopObject.position.y = 250

		this.topGroup.add( this.profileTopObject )
		this.topGroup.rotation.x = Math.PI * 0.9

		this.profileBottomObject = new CSS3DObject( profileBottom )
		this.profileBottomObject.position.y = -250

		this.bottomGroup.add( this.profileBottomObject )
		this.bottomGroup.rotation.x = - Math.PI * 0.1
	}

	setOpenProfileMemo()
	{
		if(this.isFirstRendering)
		{
			this.setCSS3DRenderer()
			this.setCloseProfileMemo()
			this.cssCanvas.addEventListener( 'mousemove', this.mouseMoveEvent )
		}
		this.isFirstRendering = false
		this.isRendering = true
		this.camera.controls.enabled = false
		this.cssScene.visible = true
		this.cssCanvas.style.pointerEvents = 'auto'
		this.cssCanvas.style.display = 'block'
		this.modelRotationTimeLine.pause()
		this.profileMemoOpenAni()
	}

	setCloseProfileMemo()
	{
		const clsBtnElement = document.querySelector('#profileClsBtn')
		clsBtnElement.addEventListener('click', () =>
		{
			this.camera.controls.enabled = true
			this.cssCanvas.style.pointerEvents = 'none'
			this.modelRotationTimeLine.play()
			this.profileMemoCloseAni()
		})
	}

	setMouseMoveEvent(e)
	{
		const x = ( e.clientX / this.sizes.width ) * 2 - 1
		const y = ( e.clientY / this.sizes.height ) * -2 + 1
		this.profileGroup.position.x += ( - x * 50 - this.profileGroup.position.x ) * 0.05
		this.profileGroup.position.y += ( - y * 50 - this.profileGroup.position.y ) * 0.05
		this.profileGroup.rotation.x += ( - y * 0.1 - this.profileGroup.rotation.x ) * 0.05
		this.profileGroup.rotation.y += ( - x * 0.5 - this.profileGroup.rotation.y ) * 0.05
	}

	profileMemoOpenAni()
	{
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
				this.cssCanvas.style,
				{
					opacity: 1,
					duration: 1,
				}
			)
		}, 1000)
	}

	profileMemoCloseAni()
	{
		gsap.to(
			this.topGroup.rotation,
			{
				x: Math.PI * 0.9,
				duration: 1,
				ease: 'power2.inOut'
			}
		)
		gsap.to(
			this.cssScene.position,
			{
				y: 0.5,
				duration: 1,
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
				ease: 'power2.inOut'
			}
		)
		gsap.to(
			this.cssCanvas.style,
			{
				opacity: 0,
				duration: 1,
				ease: 'power2.in'
			}
		)

		setTimeout(() =>
		{
			this.isRendering = false
			this.cssScene.visible = false
			this.cssCanvas.style.display = 'none'
		}, 1000)
	}

	resize()
	{
		if(this.cssRenderer) this.cssRenderer.setSize(this.sizes.width, this.sizes.height)
	}

	update()
	{
		if(this.isDrawerOpened) this.updateRaycaster()
		if(this.isRendering)
		{
			this.cssRenderer.render(this.cssScene, this.camera.instance)
		}
	}
}