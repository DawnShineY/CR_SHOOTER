import GUI from 'lil-gui'
import * as THREE from 'three'
import { CSS3DObject, CSS3DRenderer } from 'three/examples/jsm/Addons.js'

const gui = new GUI()

const cssScene = new THREE.Scene()
cssScene.rotation.y = Math.PI * 0.25
const positionParameter = 0
cssScene.position.set(0, 1, 0)

const scaleParameter = 0.005
cssScene.scale.set(scaleParameter, scaleParameter, scaleParameter)

const profileGroup = new THREE.Group()
cssScene.add(profileGroup)
profileGroup.rotation.x = - Math.PI * 0.25
gui.add(profileGroup.rotation, 'x').name('전체 회전').min(-Math.PI).max(Math.PI).step(0.001)

const bottomGroup = new THREE.Group()
const topGroup = new THREE.Group()
profileGroup.add(bottomGroup, topGroup)

const sizes = {
	width: window.innerWidth,
	height: window.innerHeight
}
window.addEventListener('resize', () =>
{
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight

	cssRenderer.setSize(sizes.width, sizes.height)
})
const cssRenderer = new CSS3DRenderer()
cssRenderer.setSize(sizes.width, sizes.height)

const profileTop = document.getElementById('profile_top')
const profileBottom = document.getElementById('profile_bottom')

const profileTopObject = new CSS3DObject( profileTop )
profileTopObject.position.y = 250

topGroup.add(profileTopObject)
topGroup.rotation.x = Math.PI * 0.1

const profileBottomObject = new CSS3DObject( profileBottom )
profileBottomObject.position.y = -250

bottomGroup.add(profileBottomObject)
bottomGroup.rotation.x = -Math.PI * 0.1

/**
 * Click event
 */
const projectLinkElement = document.getElementsByClassName('profile__info_link')[0]
projectLinkElement.addEventListener('pointerdown', () => { console.log('hihi') })


gui.add(topGroup.rotation, 'x').name('위 프로필 회전').min(-Math.PI).max(Math.PI).step(0.001)
gui.add(bottomGroup.rotation, 'x').name('아래 프로필 회전').min(-Math.PI).max(Math.PI).step(0.001)

cssRenderer.domElement.style.position = 'fixed'
cssRenderer.domElement.style.top = 0
cssRenderer.domElement.style.zIndex = 10
document.body.appendChild(cssRenderer.domElement)

console.log(profileBottomObject)


export { cssRenderer, cssScene, profileTopObject, profileBottomObject }