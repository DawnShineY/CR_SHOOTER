import * as THREE from 'three'
import Experience from '../../../../Experience.js'
import setInteractionGroup from '../../../../Helpers/setInteractionGroup.js'

export default class LaptopScreen
{
	constructor(_interactionObjects)
	{
		this.experience = new Experience()
		this.resources = this.experience.resources
		this.time = this.experience.time
		this.raycaster = this.experience.raycaster
		this.renderer = this.experience.renderer
		this.interactionObjects = _interactionObjects
		this.model = this.interactionObjects.laptopScreen
		this.laptopScreenModel = this.resources.items.laptopScreenModel.scene
		this.laptopInteractionObjects = setInteractionGroup(this.laptopScreenModel, 'InteractionGroup')
		this.prevLaptopTextBoxObject = null


		this.setRenderTarget()
		this.setRenderTexture()
		this.setMaterial()
		this.updateRaycaster()
	}

	setRenderTarget()
	{
		this.renderTarget = new THREE.WebGLRenderTarget(
			1024,
			1024,
			{
				minFilter: THREE.LinearMipMapLinearFilter,
				generateMipmaps: true,
				samples: 2
			}
		)
	}

	setMaterial()
	{
		this.model.material = new THREE.MeshBasicMaterial({
			map: this.renderTarget.texture
		})
	}

	setRenderTexture()
	{
		// Scene, camera
		this.scene = new THREE.Scene()
		this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
		this.camera.position.set(0, 0, 3.5)

		// textures
		this.matcapTexture = this.resources.items.laptopMatcapTexture
		this.matcapTexture.colorSpace = THREE.SRGBColorSpace
		this.textEventTexture = this.resources.items.laptopEventTexture
		this.textEventTexture.flipY = false
		this.textMissionTexture = this.resources.items.laptopMissionTexture
		this.textMissionTexture.flipY = false
		this.textProfileTexture = this.resources.items.laptopProfileTexture
		this.textProfileTexture.flipY = false
		this.textAppearanceTexture = this.resources.items.laptopAppearanceTexture
		this.textAppearanceTexture.flipY = false

		// Material
		this.basicMatcapMaterial = new THREE.MeshMatcapMaterial(
			{
				matcap: this.matcapTexture
			}
		)
		this.textMatcapMaterial = new THREE.MeshMatcapMaterial(
			{
				matcap: this.matcapTexture,
			}
		)
		this.sectionMaterial = new THREE.MeshBasicMaterial(
			{
				color: '#000000',
			}
		)

		for(let key in this.laptopInteractionObjects.textBoxGroup)
		{
			this.laptopInteractionObjects.textBoxGroup[ key ].material = this.textMatcapMaterial
		}

		// Model
		this.laptopScreenModel.traverse(( child ) =>
		{
			if(child.isLine)
			{
				child.material.color.set('#2d961d')
				child.material.blending = THREE.AdditiveBlending
				child.material.depthTest = false
				child.material.transparent = true
				child.material.opacity = 1
			}
			else if(child.isMesh)
			{
				child.material = this.basicMatcapMaterial
			}
		})

		// Text
		const textGroup = this.laptopInteractionObjects.textBoxGroup
		for(let key in textGroup)
		{
			textGroup[ key ].visible = false
			textGroup[ key ].material = this.textMatcapMaterial
		}

		// section
		const sectionGroup = this.laptopInteractionObjects.sectionGroup
		for(let key in sectionGroup)
		{
			sectionGroup[ key ].material = this.sectionMaterial
		}

		this.laptopScreenModel.scale.set(0.3, 0.3, 0.3)
		this.scene.add(this.laptopScreenModel)

	}

	updateRaycaster()
	{
		this.raycaster.on('tick', () =>
		{
			this.intersection = this.raycaster.instance.intersectObject(this.model)

			if(this.intersection.length > 0)
			{
				this.uv = this.intersection[ 0 ].uv
				this.uvCoord = {
					x: ( this.uv.x - 0.5 ) * 2,
					y: ( this.uv.y - 0.5 ) * 2
				}

				this.laptopScreenModel.position.x += ( - this.uvCoord.x * 0.2 - this.laptopScreenModel.position.x ) * 0.05
				this.laptopScreenModel.position.y += ( - this.uvCoord.y * 0.2 - this.laptopScreenModel.position.y ) * 0.05

				this.laptopScreenModel.rotation.x += ( - this.uvCoord.y * 0.2 - this.laptopScreenModel.rotation.x ) * 0.02
				this.laptopScreenModel.rotation.y += ( - this.uvCoord.x * 0.3 - this.laptopScreenModel.rotation.y ) * 0.04

				// LaptopScreen Inner Model Intersection

				this.raycaster.instance.setFromCamera( this.uvCoord, this.camera )
				this.laptopIntersections = this.raycaster.instance.intersectObjects([
					this.laptopInteractionObjects.sectionGroup.sectionAppearance,
					this.laptopInteractionObjects.sectionGroup.sectionEvent,
					this.laptopInteractionObjects.sectionGroup.sectionProfile,
					this.laptopInteractionObjects.textMission,
				])

				if(this.laptopIntersections.length > 0)
				{
					const intersectObjectName = this.laptopIntersections[ 0 ].object.name
					const textGroup = this.laptopInteractionObjects.textBoxGroup

					if(this.prevLaptopTextBoxObject && this.laptopIntersections[ 0 ].object != this.prevLaptopTextBoxObject)
					{
						this.prevLaptopTextBoxObject.visible = false
						document.body.style.cursor = 'default'
					}

					if(intersectObjectName === 'sectionAppearance')
					{
						textGroup.textBoxAppearance.visible = true
						this.textMatcapMaterial.map = this.textAppearanceTexture
						this.prevLaptopTextBoxObject = textGroup.textBoxAppearance
					}
					else if(intersectObjectName === 'sectionEvent')
					{
						textGroup.textBoxEvent.visible = true
						this.textMatcapMaterial.map = this.textEventTexture
						this.prevLaptopTextBoxObject = textGroup.textBoxEvent
					}
					else if(intersectObjectName === 'sectionProfile')
					{
						textGroup.textBoxProfile.visible = true
						this.textMatcapMaterial.map = this.textProfileTexture
						this.prevLaptopTextBoxObject = textGroup.textBoxProfile
					}
					else if(intersectObjectName === 'textMission')
					{
						textGroup.textBoxMission.visible = true
						this.textMatcapMaterial.map = this.textMissionTexture
						this.prevLaptopTextBoxObject = textGroup.textBoxMission
					}

					this.textMatcapMaterial.needsUpdate = true
					document.body.style.cursor = 'pointer'
				}
				else
				{
					if(this.prevLaptopTextBoxObject)
						this.prevLaptopTextBoxObject.visible = false

					document.body.style.cursor = 'default'
				}
			}
			else
			{
				this.laptopScreenModel.position.x += ( 0 - this.laptopScreenModel.position.x ) * 0.05
				this.laptopScreenModel.position.y += ( 0 - this.laptopScreenModel.position.y ) * 0.05

				this.laptopScreenModel.rotation.x += ( 0 - this.laptopScreenModel.rotation.x ) * 0.02
				this.laptopScreenModel.rotation.y += ( 0 - this.laptopScreenModel.rotation.y ) * 0.04
			}
		})
	}

	setAnimation()
	{
		this.laptopInteractionObjects.man.rotation.y = this.time.elapsed * 0.001
		this.laptopInteractionObjects.earth.geometry.rotateY( this.time.delta * 0.001 )
		this.laptopInteractionObjects.textMission.rotation.y = Math.sin( this.time.elapsed * 0.001 )* 0.1
		this.laptopInteractionObjects.textMission.rotation.y = Math.sin( this.time.elapsed * 0.001 )* 0.1

		this.laptopInteractionObjects.barGroup.bar1.scale.x =  Math.abs( Math.sin(this.time.elapsed * 0.0003 + 0) * Math.abs(Math.cos(this.time.elapsed * 0.0005)) )
		this.laptopInteractionObjects.barGroup.bar2.scale.x =  Math.abs( Math.sin(this.time.elapsed * 0.0002 + 1) * Math.abs(Math.cos(this.time.elapsed * 0.0002 + 3)) )
		this.laptopInteractionObjects.barGroup.bar3.scale.x =  Math.abs( Math.sin(this.time.elapsed * 0.0005 + 2)) * 0.5 + 0.5
	}

	update()
	{
		this.setAnimation()
		this.renderer.instance.setRenderTarget( this.renderTarget )
		this.renderer.instance.render( this.scene, this.camera )
		this.renderer.instance.setRenderTarget( null )
	}
}