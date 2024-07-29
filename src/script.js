import * as THREE from 'three'
import { DRACOLoader, GLTFLoader, OrbitControls } from 'three/examples/jsm/Addons.js'

/**
 * Base
*/
const canvas = document.getElementById('webgl')
const scene = new THREE.Scene()

// sizes
const sizes =
{
	width: window.innerWidth,
	height: window.innerHeight
}
window.addEventListener('resize', () =>
{
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight

	camera.aspect = sizes.width / sizes.height
	camera.updateProjectionMatrix()

	renderer.setSize(sizes.width, sizes.height)
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(20, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 2, 4)
scene.add(camera)

const orbitControl = new OrbitControls(camera, canvas)
orbitControl.enableDamping = true

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight('#ffffff', 5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight('#ffffff', 0.8)
directionalLight.position.set(1, 2, 3)
scene.add(directionalLight)

/**
 * Loaders
 */
const textureLoader = new THREE.TextureLoader()
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Models
*/
const roomModelGroup = new THREE.Group()
scene.add(roomModelGroup)
gltfLoader.load(
	'/gltf/model.gltf',
	(gltf) =>
	{
		gltf.scene.scale.set(0.12, 0.12, 0.12)
		roomModelGroup.add(gltf.scene)
		const boundingBox = new THREE.Box3().setFromObject(gltf.scene)
		const boundingBoxSize = new THREE.Vector3()
		boundingBox.getSize(boundingBoxSize)
		roomModelGroup.position.y -= boundingBoxSize.y * 0.4
	}
)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer(
{
	antialias: true,
	canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.render(scene, camera)

/**
 * Update
 */
const clock = new THREE.Clock()
const tick = () =>
{
	orbitControl.update()
	renderer.render(scene, camera)
	window.requestAnimationFrame(tick)
}

tick()