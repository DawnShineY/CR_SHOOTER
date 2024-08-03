import * as THREE from 'three'
import { DRACOLoader, GLTFLoader, OrbitControls } from 'three/examples/jsm/Addons.js'
import GUI from 'lil-gui'

/**
 * Debug
 */
const gui = new GUI()

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
const camera = new THREE.PerspectiveCamera(20    , sizes.width / sizes.height, 0.1, 100)
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
 * Texture
 */
const canShadowOpacityTexture = textureLoader.load('/texture/canShadowOpacity.webp')
canShadowOpacityTexture.flipY = false

const gunShadowOpacityTexture = textureLoader.load('/texture/gunShadowOpacity.webp')
gunShadowOpacityTexture.flipY = false

/**
 * Models
*/
const interactionObjects = {}
let pointerInstancedMesh  = null
const roomModelGroup = new THREE.Group()
scene.add(roomModelGroup)

/**
 * 여러개의 mesh로 이루어진 그룹의 요소를 객체 {name: Mesh} 형태로 정리
 * @param {object} object mesh들을 저장 할 객체
 * @param {array} children gltf에 저장되어 있는 group의 children 배열
 */
const setObjectGroup = (object, children) =>
{
	for(let child of children)
	{
		if(child.children.length && !child.isMesh) // 자식이 있는 empty의 경우
		{
			object[child.name] = {}
			setObjectGroup(object[child.name], child.children)
		}
		else // 자식이 없거나 자식이 있는 mesh의 경우
		{
			if(child.children.length) // 자식이 있는 mesh의 경우
			{
				setObjectGroup(object, child.children)
			}
			object[child.name] = child
		}
	}
}


gltfLoader.load(
	'/gltf/model.gltf',
	(gltf) =>
	{
		// 모델 로딩, scene 추가
		const model = gltf.scene
		model.scale.set(0.12, 0.12, 0.12)
		const boundingBox = new THREE.Box3().setFromObject(model)
		const boundingBoxSize = new THREE.Vector3()
		boundingBox.getSize(boundingBoxSize)
		roomModelGroup.position.y -= boundingBoxSize.y * 0.4
		roomModelGroup.add(model)
		console.log(model)

		// interaction group 저장
		const interactionGroup = model.children.find((child) => child.name === 'InteractionGroup')
		setObjectGroup(interactionObjects, interactionGroup.children)
		console.log('interaction objects', interactionObjects)

		// pointer instanced mesh 저장
		pointerInstancedMesh = model.children.find((child) => child.name === 'PointerGroup')
		pointerInstancedMesh.material.transparent = true

		// can, gun shadow texture 적용
		interactionObjects.gunShadow.material = new THREE.MeshStandardMaterial({
			color: '#000000',
			transparent: true,
			alphaMap: gunShadowOpacityTexture
		})
		interactionObjects.canShadow.material = new THREE.MeshStandardMaterial({
			color: '#000000',
			transparent: true,
			alphaMap: canShadowOpacityTexture
		})

		// calendar date 가져오기
		const fullDate = new Date()
		const date = fullDate.getDate() // 일
		const day  = fullDate.getDay() // 요일
		const month = fullDate.getMonth() // 월

		// calendar texture 적용
		interactionObjects.CalendarGroup.calendarDate.material.map.offset.x += 0.2468 * ( Math.floor(date / 10) )
		interactionObjects.CalendarGroup.calendarDate.material.map.offset.y += 0.094 * ( date % 10 )
		interactionObjects.CalendarGroup.calendarDay.material.map.offset.y += 0.133 * day
		interactionObjects.CalendarGroup.calendarMonth.material.map.offset.y += 0.082 * ( month - 1 )

		// debug
		gui.add(pointerInstancedMesh.material, 'opacity').name('pointer 투명도').min(0).max(1).step(0.01)
		gui.add(interactionObjects.laptopCover.rotation, 'z').name('노트북 커버 회전').min(0).max(Math.PI * 0.8).step(0.01)
		gui.add(interactionObjects.lockerDoor.rotation, 'y').name('락카 문 회전').min(-Math.PI * 0.4).max(0).step(0.01)
		gui.add(interactionObjects.drawer.position, 'x').name('서랍').min(-3.4015002250671387).max(-2.8).step(0.01)
		gui.add(interactionObjects.gun.position, 'x').name('총 x').min(1.4246635437011719).max(10).step(0.01)
		gui.add(interactionObjects.gun.position, 'y').name('총 y').min(1.856541633605957).max(10).step(0.01)
		gui.add(interactionObjects.gun.position, 'z').name('총 z').min(0.1796553134918213).max(10).step(0.01)
		gui.add(interactionObjects.gun.rotation, 'y').name('총 회전').min(0).max(Math.PI * 2).step(0.01)
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