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
		const matcapTexture = loaders.textureLoader.load('/texture/matcap/3.png')
		matcapTexture.colorSpace = THREE.SRGBColorSpace
		const textBoxBriefTexture = loaders.textureLoader.load('./texture/web/web-brief.png')
		textBoxBriefTexture.flipY = false
		const textBoxAppearanceTexture = loaders.textureLoader.load('./texture/web/web-appearance.png')
		textBoxAppearanceTexture.flipY = false
		const textBoxProfileTexture = loaders.textureLoader.load('./texture/web/web-profile.png')
		textBoxProfileTexture.flipY = false
		const textBoxEventTexture = loaders.textureLoader.load('./texture/web/web-event.png')
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
			'/gltf-web/model.gltf',
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

				this.intersectionGroup = this.model.children.find((child) => child.name === 'IntersectionGroup')
				setObjectGroup(this.intersectObjects, this.intersectionGroup.children)
				console.log(this.intersectObjects)

				for(let key in this.intersectObjects.SectionGroup)
				{
					this.intersectObjects.SectionGroup[key].material = sectionMaterial
				}

				for(let key in this.intersectObjects.TextBoxGroup)
				{
					this.intersectObjects.TextBoxGroup[key].visible = false
				}

				this.intersectObjects.TextBoxGroup.textBox_appearance.material = textBoxAppearanceMatcapMaterial
				this.intersectObjects.TextBoxGroup.textBox_brief.material = textBoxBriefMatcapMaterial
				this.intersectObjects.TextBoxGroup.textBox_event.material = textBoxEventMatcapMaterial
				this.intersectObjects.TextBoxGroup.textBox_profile.material = textBoxProfileMatcapMaterial


				this.model.position.set(0, 0, 0)
				this.model.scale.set(0.3, 0.3, 0.3)
				scene.add(this.model)
			}
		)
	}

}

export default LaptopScreen