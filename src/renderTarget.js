import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/Addons.js'

class LaptopScreen {
	constructor(loaders, setObjectGroup) {

		this.model = {}
		this.intersectObjects = {}

		/**
		 * RenderTarget
		 */
		this.renderTarget = new THREE.WebGLRenderTarget(
			1024,
			1024,
			{
				minFilter: THREE.LinearMipMapLinearFilter,
				generateMipmaps: true,
				//wrapS: THREE.RepeatWrapping,
				//wrapT: THREE.RepeatWrapping
				samples: 2
			}
		)

		/**
		 * Scene, Camera
		 */
		const scene = this.scene = new THREE.Scene()
		const camera = this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
		camera.position.set(0, 0, 3.5)

		/**
		 * Textures
		 */
		const matcapTexture = loaders.textureLoader.load('/texture/laptopScreen/matcap.png')
		matcapTexture.colorSpace = THREE.SRGBColorSpace
		const textBoxBriefTexture = loaders.textureLoader.load('./texture/laptopScreen/textBrief.png')
		textBoxBriefTexture.flipY = false
		const textBoxAppearanceTexture = loaders.textureLoader.load('./texture/laptopScreen/textAppearance.png')
		textBoxAppearanceTexture.flipY = false
		const textBoxProfileTexture = loaders.textureLoader.load('./texture/laptopScreen/textProfile.png')
		textBoxProfileTexture.flipY = false
		const textBoxEventTexture = loaders.textureLoader.load('./texture/laptopScreen/textEvent.png')
		textBoxEventTexture.flipY = false

		/**
		 * Material
		 */
		const basicMatcapMaterial = new THREE.MeshMatcapMaterial(
			{
				matcap: matcapTexture,
			}
		)
		const textBoxBriefMatcapMaterial = new THREE.MeshMatcapMaterial(
			{
				matcap: matcapTexture,
				map: textBoxBriefTexture,
			}
		)
		const textBoxAppearanceMatcapMaterial = new THREE.MeshMatcapMaterial(
			{
				matcap: matcapTexture,
				map: textBoxAppearanceTexture,
			}
		)
		const textBoxProfileMatcapMaterial = new THREE.MeshMatcapMaterial(
			{
				matcap: matcapTexture,
				map: textBoxProfileTexture,
			}
		)
		const textBoxEventMatcapMaterial = new THREE.MeshMatcapMaterial(
			{
				matcap: matcapTexture,
				map: textBoxEventTexture,
			}
		)
		const sectionMaterial = new THREE.MeshBasicMaterial({
			color: 'black'
		})

		/**
		 * Models
		 */
		loaders.gltfLoader.load(
			'/gltf/laptopScreen/model.gltf',
			(gltf) =>
			{
				this.model = gltf.scene

				gltf.scene.traverse((child) =>
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
						child.material = basicMatcapMaterial
					}
				})

				this.intersectionGroup = this.model.children.find((child) => child.name === 'InteractionGroup')
				setObjectGroup(this.intersectObjects, this.intersectionGroup.children)
				console.log(this.intersectObjects)

				for(let key in this.intersectObjects.SectionGroup)
				{
					this.intersectObjects.SectionGroup[key].material = sectionMaterial
				}

				for(let key in this.intersectObjects.textBoxGroup)
				{
					this.intersectObjects.textBoxGroup[key].visible = false
				}

				this.intersectObjects.textBoxGroup.textBoxAppearance.material = textBoxAppearanceMatcapMaterial
				this.intersectObjects.textBoxGroup.textBoxMission.material = textBoxBriefMatcapMaterial
				this.intersectObjects.textBoxGroup.textBoxEvent.material = textBoxEventMatcapMaterial
				this.intersectObjects.textBoxGroup.textBoxProfile.material = textBoxProfileMatcapMaterial


				this.model.position.set(0, 0, 0)
				this.model.scale.set(0.3, 0.3, 0.3)
				scene.add(this.model)
			}
		)
	}

}

export default LaptopScreen