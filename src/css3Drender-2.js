import * as THREE from 'three'
import { CSS3DObject, CSS3DRenderer, OrbitControls } from 'three/examples/jsm/Addons.js'

const scene = new THREE.Scene()
//scene.background = new THREE.Color('#e1e1e1')
const sizes = {
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
	rendererCss.setSize(sizes.width, sizes.height)
})

const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000)
scene.add(camera)
camera.position.set(8, 8, 15)

const renderer = new THREE.WebGLRenderer({
	antialias: true,
	alpha: true
})
renderer.setSize(sizes.width, sizes.height)
//renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
document.body.appendChild(renderer.domElement)

const control = new OrbitControls(camera, renderer.domElement)
control.enableDamping = true
const ambientLight = new THREE.AmbientLight(0xffffff, 2)
const light = new THREE.PointLight(0xffffff, 0.5)
light.position.set(0, 10, 0)
scene.add(ambientLight, light)

const floorMaterial = new THREE.MeshBasicMaterial({
	color: 'blue',
	side: THREE.DoubleSide
})
const floorGeometry = new THREE.PlaneGeometry(10, 10)
const floor = new THREE.Mesh(floorGeometry, floorMaterial)
floor.rotation.x = Math.PI / 2
scene.add(floor)

const planeMaterial = new THREE.MeshBasicMaterial({
	color: 0x000000,
	opacity: 0.1,
	side: THREE.DoubleSide,
	transparent: true
})
const planeWidth = 8
const planeHeight = 4
const planeGeometry = new THREE.PlaneGeometry( planeWidth, planeHeight )
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
planeMesh.position.y = 2
scene.add(planeMesh)


/**
 * CSS
 */
const cssScene = new THREE.Scene()
const element = document.createElement('iframe')
element.src = 'https://threejs.org/'
const elementWidth = 1024
const aspectRatio = 8 / 4
const elementHeight = elementWidth * aspectRatio

element.style.width = elementWidth + 'px'
element.style.height = elementHeight + 'px'

const cssObject = new CSS3DObject( element )
cssObject.position.copy(planeMesh.position)
cssObject.rotation.copy(planeMesh.rotation)

const percentBorder = 0.05
cssObject.scale.x /= (1 + percentBorder) * (elementWidth / planeWidth)
cssObject.scale.y /= (1 + percentBorder) * (elementWidth / planeWidth)
cssScene.add(cssObject)

const rendererCss = new CSS3DRenderer()
rendererCss.setSize( sizes.width, sizes.height )
rendererCss.domElement.style.position = 'absolute'
rendererCss.domElement.style.top = 0
rendererCss.domElement.style.margin = 0
rendererCss.domElement.style.padding = 0
document.body.appendChild(rendererCss.domElement)

renderer.domElement.style.position = 'absolute'
//renderer.domElement.style.top = 0

//rendererCss.domElement.style.zIndex = 1
rendererCss.domElement.appendChild( renderer.domElement )




const tick = () =>
{
	control.update()
	rendererCss.render(cssScene, camera)
	renderer.render(scene, camera)
	window.requestAnimationFrame(tick)
}
tick()