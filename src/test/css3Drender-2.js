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


/**
 * CSS
 */
const cssScene = new THREE.Scene()
const element = document.createElement('div')
element.style.width = '100px'
element.style.height = '100px'
element.style.background = 'red'
element.innerHTML = `
	<input />
	가나다라마바사아
`


const cssObject = new CSS3DObject( element )
cssObject.scale.set(0.01, 0.01, 0.01)


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
//document.body.appendChild( renderer.domElement )


const control = new OrbitControls(camera, rendererCss.domElement)
control.enableDamping = true

const tick = () =>
{
	control.update()
	rendererCss.render(cssScene, camera)
	renderer.render(scene, camera)
	window.requestAnimationFrame(tick)
}
tick()