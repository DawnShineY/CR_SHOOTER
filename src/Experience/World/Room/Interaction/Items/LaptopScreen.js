import { WebGLRenderTarget, LinearMipMapLinearFilter, AdditiveBlending, MeshBasicMaterial, Scene, PerspectiveCamera, MeshMatcapMaterial, SRGBColorSpace } from 'three'
import Experience from '@/Experience/Experience.js'
import setInteractionGroup from '@/Experience/Helpers/setInteractionGroup.js'
import Interaction from '../Interaction.js'
import gsap from 'gsap'

export default class LaptopScreen
{
	constructor(_interactionObjects)
	{
		this.interactionObjects = _interactionObjects
		this.model = this.interactionObjects.laptopScreen
		this.laptopCoverModel = this.interactionObjects.laptopCover
		this.laptopCoverModel.rotation.y = Math.PI

		this.experience = new Experience()
		this.resources = this.experience.resources
		this.time = this.experience.time
		this.debug =this.experience.debug
		this.raycaster = this.experience.raycaster
		this.renderer = this.experience.renderer
		this.laptopScreenModel = this.resources.items.laptopScreenModel.scene // laptop screen inner model

		this.prevLaptopTextBoxObject = null
		this.laptopInteractionObjects = setInteractionGroup(this.laptopScreenModel, 'InteractionGroup')

		this.setRenderTargetTexture()
		this.setLaptopModel()

		this.interaction = new Interaction()
		this.pointer = this.interaction.pointer
		this.isActive = false
		this.setPointerEvent()
		this.resetPointerEvent()

		// debug
		if(this.debug.active)
		{
			this.debugFolder = this.debug.ui.addFolder('노트북')
			this.debugFolder.add(this.laptopCoverModel.rotation, 'y').name('노트북 커버 회전').min(Math.PI * 0.3).max(Math.PI).step(0.01)
		}
	}

	setPointerEvent()
	{
		this.pointer.on('click', (obj) =>
		{
			if(obj === 'laptop')
			{
				this.isActive = true
				gsap.to(
					this.laptopCoverModel.rotation,
					{
						y: Math.PI * 0.4,
						duration: 1,
						delay: 0.8,
						ease: 'power2.inOut'
					}
				)

				return
			}
		})
	}
	resetPointerEvent()
	{
		this.pointer.on('reset', (obj) =>
		{
			this.isActive = false
			gsap.to(
				this.laptopCoverModel.rotation,
				{
					y: Math.PI,
					duration: 1,
					delay: 0,
					ease: 'power2.inOut'
				}
			)
		})
	}

	setRenderTargetTexture()
	{
		// WebGlRenderTarget
		this.renderTarget = new WebGLRenderTarget(
			1024,
			1024,
			{
				minFilter: LinearMipMapLinearFilter,
				generateMipmaps: true,
				samples: 2
			}
		)

		// RenderTarget Texture
		this.model.material = new MeshBasicMaterial({
			map: this.renderTarget.texture
		})
	}

	setLaptopModel()
	{
		// Scene, camera
		this.scene = new Scene()
		this.camera = new PerspectiveCamera( 45, 1, 0.1, 100 )
		this.camera.position.set( 0, 0, 3.5 )

		// textures
		this.matcapTexture = this.resources.items.laptopMatcapTexture
		this.matcapTexture.colorSpace = SRGBColorSpace
		this.textEventTexture = this.resources.items.laptopEventTexture
		this.textEventTexture.flipY = false
		this.textMissionTexture = this.resources.items.laptopMissionTexture
		this.textMissionTexture.flipY = false
		this.textProfileTexture = this.resources.items.laptopProfileTexture
		this.textProfileTexture.flipY = false
		this.textAppearanceTexture = this.resources.items.laptopAppearanceTexture
		this.textAppearanceTexture.flipY = false

		// Material
		this.basicMatcapMaterial = new MeshMatcapMaterial(
			{
				matcap: this.matcapTexture
			}
		)
		this.textMatcapMaterial = new MeshMatcapMaterial(
			{
				matcap: this.matcapTexture,
			}
		)
		this.sectionMaterial = new MeshBasicMaterial(
			{
				color: '#000000',
			}
		)

		// Model
		this.laptopScreenModel.traverse(( child ) =>
		{
			if(child.isLine)
			{
				child.material.color.set( '#2d961d' )
				child.material.blending = AdditiveBlending
				child.material.depthTest = false
				child.material.transparent = true
				child.material.opacity = 1
			}
			else if(child.isMesh)
			{
				child.material = this.basicMatcapMaterial
			}
		})

		// Text Box
		const textBoxGroup = this.laptopInteractionObjects.textBoxGroup
		for(let key in textBoxGroup)
		{
			textBoxGroup[ key ].visible = false
			textBoxGroup[ key ].material = this.textMatcapMaterial
		}

		// Section Group
		const sectionGroup = this.laptopInteractionObjects.sectionGroup
		for(let key in sectionGroup)
		{
			sectionGroup[ key ].material = this.sectionMaterial
		}

		this.laptopScreenModel.scale.set( 0.3, 0.3, 0.3 )
		this.scene.add( this.laptopScreenModel )
	}

	setAnimation()
	{
		this.laptopInteractionObjects.man.rotation.y = this.time.elapsed
		this.laptopInteractionObjects.earth.geometry.rotateY( this.time.delta )
		this.laptopInteractionObjects.textMission.rotation.y = Math.sin( this.time.elapsed )* 0.1
		this.laptopInteractionObjects.textMission.rotation.y = Math.sin( this.time.elapsed )* 0.1

		this.laptopInteractionObjects.barGroup.bar1.scale.x =  Math.abs( Math.sin( this.time.elapsed * 0.3 + 0 ) * Math.abs(Math.cos(this.time.elapsed * 0.5)) )
		this.laptopInteractionObjects.barGroup.bar2.scale.x =  Math.abs( Math.sin( this.time.elapsed * 0.2 + 1 ) * Math.abs(Math.cos(this.time.elapsed * 0.2 + 3)) )
		this.laptopInteractionObjects.barGroup.bar3.scale.x =  Math.abs( Math.sin( this.time.elapsed * 0.5 + 2 )) * 0.5 + 0.5
	}

	updateRaycaster()
	{
		// LaptopScreen Outer Intersection (Black screen)
		const intersection = this.raycaster.instance.intersectObject( this.model )

		if(intersection.length > 0)
		{
			this.uv = intersection[ 0 ].uv
			this.uvCoord = {
				x: ( this.uv.x - 0.5 ) * 2,
				y: ( this.uv.y - 0.5 ) * 2
			}

			this.laptopScreenModel.position.x += ( - this.uvCoord.x * 0.2 - this.laptopScreenModel.position.x ) * 0.05
			this.laptopScreenModel.position.y += ( - this.uvCoord.y * 0.2 - this.laptopScreenModel.position.y ) * 0.05
			this.laptopScreenModel.rotation.x += ( - this.uvCoord.y * 0.2 - this.laptopScreenModel.rotation.x ) * 0.02
			this.laptopScreenModel.rotation.y += ( - this.uvCoord.x * 0.3 - this.laptopScreenModel.rotation.y ) * 0.04

			// LaptopScreen Inner Model Intersection
			this.updateTextureRaycaster()
		}
		else
		{
			this.laptopScreenModel.position.x += ( 0 - this.laptopScreenModel.position.x ) * 0.05
			this.laptopScreenModel.position.y += ( 0 - this.laptopScreenModel.position.y ) * 0.05
			this.laptopScreenModel.rotation.x += ( 0 - this.laptopScreenModel.rotation.x ) * 0.02
			this.laptopScreenModel.rotation.y += ( 0 - this.laptopScreenModel.rotation.y ) * 0.04
		}
	}

	updateTextureRaycaster()
	{
		this.raycaster.instance.setFromCamera( this.uvCoord, this.camera )
		const intersections = this.raycaster.instance.intersectObjects([
			this.laptopInteractionObjects.sectionGroup.sectionAppearance,
			this.laptopInteractionObjects.sectionGroup.sectionEvent,
			this.laptopInteractionObjects.sectionGroup.sectionProfile,
			this.laptopInteractionObjects.textMission,
		])

		if(this.prevLaptopTextBoxObject)
		{
			this.prevLaptopTextBoxObject.visible = false
			document.body.style.cursor = 'default'
			this.prevLaptopTextBoxObject = null
		}

		if(intersections.length > 0)
		{
			const intersectObjectName = intersections[ 0 ].object.name
			const textBoxGroup = this.laptopInteractionObjects.textBoxGroup

			if(intersectObjectName === 'sectionAppearance')
			{
				textBoxGroup.textBoxAppearance.visible = true
				this.textMatcapMaterial.map = this.textAppearanceTexture
				this.prevLaptopTextBoxObject = textBoxGroup.textBoxAppearance
			}
			else if(intersectObjectName === 'sectionEvent')
			{
				textBoxGroup.textBoxEvent.visible = true
				this.textMatcapMaterial.map = this.textEventTexture
				this.prevLaptopTextBoxObject = textBoxGroup.textBoxEvent
			}
			else if(intersectObjectName === 'sectionProfile')
			{
				textBoxGroup.textBoxProfile.visible = true
				this.textMatcapMaterial.map = this.textProfileTexture
				this.prevLaptopTextBoxObject = textBoxGroup.textBoxProfile
			}
			else if(intersectObjectName === 'textMission')
			{
				textBoxGroup.textBoxMission.visible = true
				this.textMatcapMaterial.map = this.textMissionTexture
				this.prevLaptopTextBoxObject = textBoxGroup.textBoxMission
			}

			this.textMatcapMaterial.needsUpdate = true
			document.body.style.cursor = 'pointer'
		}
	}

	update()
	{
		if(this.isActive)
		{
			this.updateRaycaster()
			this.setAnimation()
			this.renderer.instance.setRenderTarget( this.renderTarget )
			this.renderer.instance.render( this.scene, this.camera )
			this.renderer.instance.setRenderTarget( null )
		}
	}
}