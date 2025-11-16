import * as THREE from 'three'
import { CSS3DObject, CSS3DRenderer, OrbitControls } from 'three/examples/jsm/Addons.js'

const sizes = {
	width: window.innerWidth,
	height: window.innerHeight
}
const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height, 0.1, 100)
camera.position.set(2, 2, 2)

/**
 * WebGL Renderer
 */
const scene = new THREE.Scene()
const mesh = new THREE.Mesh(
	new THREE.BoxGeometry(1, 1, 1),
	new THREE.MeshNormalMaterial()
)
mesh.position.y = -0.5
const plane = new THREE.Mesh(
	new THREE.PlaneGeometry(1, 1, 1),
	new THREE.MeshNormalMaterial({ })
)
plane.position.y = 1
scene.add(mesh)
scene.add(plane)


const renderer = new THREE.WebGLRenderer({
	alpha: true,
	antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild(renderer.domElement)

/**
 * CSS3DRenderer
 */
const scene2 = new THREE.Scene()
const renderer2 = new CSS3DRenderer()
renderer2.setSize(sizes.width, sizes.height)

const element = document.createElement('div')
element.style.width = '100px'
element.style.height = '100px'
element.style.background = 'red'
element.style.position = 'relative'
element.style.overflowY = 'scroll'
element.innerHTML = `
	<div style="
		background-color: blue;
		border-radius: 10px;
		cursor: pointer;
		margin: 10px;
		padding: 4px;
	">
		<div>button</div>
		<div>button</div>
		<div>button</div>
		<div>button</div>
		<div>button</div>
		<div>button</div>
		<div>button</div>
		<div>button</div>
		<div>button</div>
		<div>button</div>
		<div>button</div>
		<div>button</div>
		<div>button</div>
	</div>
`
//element.innerHTML = `hihi`
//element.style.opacity = 0.5

const object = new CSS3DObject( element )
object.position.copy(plane.position)
object.rotation.copy(plane.rotation)
object.scale.set(0.01, 0.01, 0.01)

scene2.add(object)



renderer2.domElement.style.position = 'fixed'
renderer2.domElement.style.top = 0
document.body.appendChild(renderer2.domElement)



const raycaster = new THREE.Raycaster()
const mouse = {}

window.addEventListener('mousemove', (event) =>
{
	mouse.x = (event.clientX / sizes.width) * 2 - 1
	mouse.y = -(event.clientY / sizes.height) * 2 + 1
})

const control = new OrbitControls(camera, renderer2.domElement)
control.enableDamping = true

const tick = () =>
{
	raycaster.setFromCamera(mouse, camera)
	const intersectObject = raycaster.intersectObjects([ mesh, plane ])
	if(intersectObject.length > 0)
	{
		document.body.style.cursor = 'pointer'
		if(intersectObject[0].object === plane)
		{
			control.enableZoom = false;
		}
	} else{

		document.body.style.cursor = 'default'
		control.enableZoom = true;

	}
	control.update()
	renderer.render(scene, camera)
	renderer2.render(scene2, camera)
	window.requestAnimationFrame(tick)
}

tick()