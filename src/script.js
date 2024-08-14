import * as THREE from 'three'
import { CSS3DObject, CSS3DRenderer, DRACOLoader, GLTFLoader, OrbitControls } from 'three/examples/jsm/Addons.js'
import GUI from 'lil-gui'
import Stats from 'stats.js'
import pointerIndex from './pointerIndex'
import LaptopScreen from './renderTarget.js'
import videoTexture from './videoTexture.js'

/**
 * Performance
 */
const stats = new Stats()
stats.showPanel(0)
document.body.append(stats.dom)

/**
 * Debug
 */
const gui = new GUI()
const debugObject = {
	lightMode: 'day'
}

/**
 * Loaders
 */
const textureLoader = new THREE.TextureLoader()
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Base
*/
const canvas = document.getElementById('webgl')
const scene = new THREE.Scene()
scene.background = new THREE.Color('#292420')
const roomModelGroup = new THREE.Group()
scene.add(roomModelGroup)


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

	renderer2.setSize(sizes.width, sizes.height)
})


/**
 * css3D rendering
 */
const scene2 = new THREE.Scene()

const element = document.createElement( 'div' );
element.style.width = 0.9190479516983032 * 1000 + 'px';
element.style.height = 0.6359846591949463  * 1000 + 'px';
element.style.opacity = 0.75;
element.style.background = 'black';
element.innerHTML = `
	<div
		onclick="console.log('hello world')"
		style="padding: 4px 2px; display: flex; background: red; border-radius: 12px; margin: 3px; align-items: center; justify-content: center; font-weight: bold; cursor: pointer;"
		>
		button
	</div>
`
const htmlGroup = new THREE.Group()
const htmlObject = new CSS3DObject( element );
htmlObject.scale.set(0.001, 0.001, 0.001)
htmlGroup.add(htmlObject)
scene2.add( htmlGroup );

const renderer2 = new CSS3DRenderer()
renderer2.setSize(sizes.width, sizes.height)
renderer2.domElement.style.position = 'absolute';
renderer2.domElement.style.top = 0;
//document.body.appendChild( renderer2.domElement );


/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(15, sizes.width / sizes.height, 1, 100)
camera.position.set(38, 13, 35)
//camera.position.set(37, 18.67, 33.56)

scene.add(camera)

/**
 * Control
 */
const orbitControl = new OrbitControls(camera, canvas)
orbitControl.enableDamping = true
orbitControl.maxPolarAngle = Math.PI / 2
orbitControl.minAzimuthAngle = 0
orbitControl.maxAzimuthAngle = Math.PI / 2
orbitControl.maxDistance = 80


/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight('#ffffff', 5)
scene.add(ambientLight)
gui.add(ambientLight, 'intensity').name('주변광').min(0).max(20).step(1)

const directionalLight = new THREE.DirectionalLight('#ffffff', 0.8)
directionalLight.position.set(1, 2, 3)
scene.add(directionalLight)


// additional Lights
const candleLight1 = new THREE.PointLight('#ff7a5c', 2, 0.5, 1)
const pointLightHelper1 = new THREE.PointLightHelper(candleLight1)
roomModelGroup.add(candleLight1, pointLightHelper1)

const candleLight2 = new THREE.PointLight('#ff7a5c', 2, 0.5, 1)
const pointLightHelper2 = new THREE.PointLightHelper(candleLight2)
roomModelGroup.add(candleLight2, pointLightHelper2)


const standLight = new THREE.SpotLight('#ffceb0', 70, 1.5, Math.PI * 0.25, 1, 0.01)
const spotLightHelper = new THREE.SpotLightHelper(standLight)
roomModelGroup.add(standLight, standLight.target, spotLightHelper)

const standLight2 = new THREE.SpotLight('#ffceb0', 100, 5, Math.PI * 0.2, 1, 1)
const spotLightHelper2 = new THREE.SpotLightHelper(standLight2)
roomModelGroup.add(standLight2, standLight2.target, spotLightHelper2)

const fireplaceLight = new THREE.PointLight('#de0000', 10, 1, 1)
const pointLightHelper3 = new THREE.PointLightHelper(fireplaceLight)
roomModelGroup.add(fireplaceLight, pointLightHelper3)

const lampLight1 = new THREE.PointLight('#ffceb0', 10, 2, 1)
const pointLightHelper4 = new THREE.PointLightHelper(lampLight1)
roomModelGroup.add(lampLight1, pointLightHelper4)

const lampLight2 = new THREE.PointLight('#ffceb0', 10, 2, 1)
const pointLightHelper5 = new THREE.PointLightHelper(lampLight2)
roomModelGroup.add(lampLight2, pointLightHelper5)

const additionalLights = [
	candleLight1, candleLight2, standLight,  standLight2,  fireplaceLight,  lampLight1, lampLight2,
	pointLightHelper1, pointLightHelper2, spotLightHelper, spotLightHelper2, pointLightHelper3, pointLightHelper4, pointLightHelper5,
]

for(let object of additionalLights)
{
	object.visible = false
}

gui.add(debugObject, 'lightMode', {
	day: 'day',
	night: 'night'
}).name('light mode').onChange((value) =>
{
	if(value === 'day')
	{
		for(let object of additionalLights)
		{
			object.visible = false
		}
		ambientLight.intensity = 5
		scene.background = new THREE.Color('#292420')

	}
	else
	{
		for(let object of additionalLights)
		{
			if(object.isLight)
			{
				object.visible = true
			}
		}
		ambientLight.intensity = 0.5
		scene.background = new THREE.Color('#000000')

	}
})



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
const pointerColor = new THREE.Color(0x7E1E00)


/**
 * 여러개의 mesh로 이루어진 그룹의 요소를 객체 {name: Mesh} 형태로 정리
 * @param {object} object mesh들을 저장 할 객체
 * @param {array} children gltf에 저장되어 있는 group의 children 배열
 */
const setObjectGroup = (object, children) =>
{
	for(let child of children)
	{
		if(child.children.length && child.type === 'Object3D') // 자식이 있는 empty의 경우
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


/**
 * RenderTarget
 */
const laptopScreen = new LaptopScreen({textureLoader, gltfLoader}, setObjectGroup)


gltfLoader.load(
	'/gltf/model.gltf',
	(gltf) =>
	{
		// 모델 로딩, scene 추가
		const model = gltf.scene
		const boundingBox = new THREE.Box3().setFromObject(model)
		const boundingBoxSize = new THREE.Vector3()
		boundingBox.getSize(boundingBoxSize)
		roomModelGroup.position.y -= boundingBoxSize.y * 0.4
		roomModelGroup.add(model)

		// interaction group 저장
		const interactionGroup = model.children.find((child) => child.name === 'InteractionGroup')
		setObjectGroup(interactionObjects, interactionGroup.children)
		console.log('interaction objects', interactionObjects)

		//camera.position.set(...pointerIndex[ 0 ].cameraPosition)
		//orbitControl.target.set(...pointerIndex[ 0 ].controlTarget)

		// lights
		candleLight1.position.copy(interactionObjects.LightsPositionGroup.candle1Position.position)
		pointLightHelper1.update()

		candleLight2.position.copy(interactionObjects.LightsPositionGroup.candle2Position.position)
		pointLightHelper2.update()

		standLight.position.copy(interactionObjects.LightsPositionGroup.standPosition.position)
		standLight.target.position.copy(interactionObjects.LightsPositionGroup.standPosition.position)
		standLight.target.position.y -= 3
		standLight.target.position.z += 0.3
		spotLightHelper.update()

		standLight2.position.copy(interactionObjects.LightsPositionGroup.lightPosition.position)
		standLight2.target.position.copy(interactionObjects.LightsPositionGroup.lightPosition.position)
		standLight2.target.position.x -= 1
		standLight2.target.position.y -= 5
		standLight2.target.position.z += 3
		spotLightHelper2.update()

		fireplaceLight.position.copy(interactionObjects.LightsPositionGroup.fireplacePosition.position)
		pointLightHelper3.update()

		lampLight1.position.copy(interactionObjects.LightsPositionGroup.lamp1Position.position)
		pointLightHelper4.update()

		lampLight2.position.copy(interactionObjects.LightsPositionGroup.lamp2Position.position)
		pointLightHelper5.update()

		// tvScreen
		interactionObjects.tvScreen.material = new THREE.MeshPhongMaterial(
			{
				color: '#e1e1e1',
				map: videoTexture,
				shininess: 100,
				specular: '#505050',
				emissive: '#171717'
			}
		)

		// laptop css3d group 위치, 회전 설정
		htmlGroup.position.set(
			interactionObjects.laptopScreen.position.x,
			interactionObjects.laptopScreen.position.y,
			interactionObjects.laptopScreen.position.z,
		);
		htmlGroup.position.y -= boundingBoxSize.y * 0.4
		htmlGroup.rotation.copy( interactionObjects.laptopCover.rotation );

		// laptop renderTarget texture 적용
		interactionObjects.laptopScreen.material =  new THREE.MeshBasicMaterial({
			//color: 'green'
			map: laptopScreen.renderTarget.texture,
			//shininess: 100,
			//specular: '#808080'
		})
		console.log()
		// wind bell rotation speed 저장
		interactionObjects.WindBellGroup.windBell01.rotationSpeed = Math.random() * 2
		interactionObjects.WindBellGroup.windBell02.rotationSpeed = Math.random() * 2
		interactionObjects.WindBellGroup.windBell03.rotationSpeed = Math.random() * 2

		// pointer instanced mesh 저장
		pointerInstancedMesh = model.children.find((child) => child.name === 'PointerGroup')
		pointerInstancedMesh.material.transparent = true

		for(let i = 0; i < pointerInstancedMesh.count; i++)
		{
			pointerInstancedMesh.setColorAt(i, pointerColor)
		}
		pointerInstancedMesh.instanceColor.needsUpdate = true;

		gui.add(pointerInstancedMesh, 'visible').name('pointer 보이기')


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
		const day  = fullDate.getDay() + 1 // 요일
		const month = fullDate.getMonth() + 1 // 월

		// calendar texture 적용
		interactionObjects.CalendarGroup.calendarDay.material.map.offset.y += 0.125 * day
		interactionObjects.CalendarGroup.calendarDate.material.map.offset.x += 0.2468 * ( Math.floor(date / 10) )
		interactionObjects.CalendarGroup.calendarDate.material.map.offset.y += 0.094 * ( date % 10 )
		interactionObjects.CalendarGroup.calendarMonth.material.map.offset.y += 0.077 * month

		// debug
		gui.add(pointerInstancedMesh.material, 'opacity').name('pointer 투명도').min(0).max(1).step(0.01)
		gui.add(interactionObjects.laptopCover.rotation, 'y').name('노트북 커버 회전').min(Math.PI * 0.3).max(Math.PI).step(0.01)
		gui.add(interactionObjects.lockerDoor.rotation, 'y').name('락카 문 회전').min(-Math.PI * 0.4).max(0).step(0.01)
		gui.add(interactionObjects.drawer.position, 'x').name('서랍').min(-3.4015002250671387).max(-2.8).step(0.01)
		gui.add(interactionObjects.gun.position, 'x').name('총 x').min(1.4246635437011719).max(10).step(0.01)
		gui.add(interactionObjects.gun.position, 'y').name('총 y').min(1.856541633605957).max(10).step(0.01)
		gui.add(interactionObjects.gun.position, 'z').name('총 z').min(0.1796553134918213).max(10).step(0.01)
		gui.add(interactionObjects.gun.rotation, 'y').name('총 회전').min(0).max(Math.PI * 2).step(0.01)
	}
)


/**
 * Mouse
 */
const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (event) =>
{
	mouse.x = event.clientX / sizes.width * 2 - 1
	mouse.y = - (event.clientY / sizes.height) * 2 + 1
})

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster()

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

const pointerCameraFocus = (index) =>
{
	return (e) =>
	{
		camera.position.set(...pointerIndex[ index ].cameraPosition)
		orbitControl.target.set(...pointerIndex[ index ].controlTarget)
	}
}


// 상태 로그 함수
function logCameraState() {
	console.log("Camera position:", camera.position);
	console.log("Camera zoom:", camera.zoom);
	console.log("Polar angle:", orbitControl.getPolarAngle());
	console.log("Azimuthal angle:", orbitControl.getAzimuthalAngle());
	console.log("Target:", orbitControl.target);
}

// 키보드 이벤트로 상태 출력
window.addEventListener('keydown', (event) => {
if (event.key === 's') { // 's' 키를 누르면 상태를 출력
	logCameraState();
	//camera.position.set(...pointerIndex[0].camera.position)
	//orbitControl.target.set(...pointerIndex[0].camera.target)
}
});

/**
 * Event 함수
 */
const laptopWheelEvent = (event) =>
	{
		const wheel = event.wheelDeltaY
		const offsetY = 0.02

		if(wheel > 0)
		{
			laptopScreen.camera.position.y += offsetY
		}
		if(wheel < 0)
		{
			laptopScreen.camera.position.y -= offsetY

		}
	}

/**
 * Update
 */
const clock = new THREE.Clock()
const pointerActivateColor = new THREE.Color(0xec4a38)
let prevPointerInstancedId = null
const pointerMatrix = new THREE.Matrix4()
const scaleAmount = 1.5
const scaleUpMatrix = new THREE.Matrix4().makeScale(scaleAmount, scaleAmount, scaleAmount)
const scaleDownMatrix = new THREE.Matrix4().makeScale(1/scaleAmount, 1/scaleAmount, 1/scaleAmount)
let isMouseIn = false
let pointerClickEventFunction

const testRaycaster = new THREE.Raycaster()

const tick = () =>
{
	stats.begin()
	const elapsedTime = clock.getElapsedTime()

	/**
	 * Wind bell rotation
	 */
	for(let key in interactionObjects.WindBellGroup)
	{
		const windbell = interactionObjects.WindBellGroup[key]
		windbell.rotation.y = Math.sin(elapsedTime * windbell.rotationSpeed) * 0.5
	}

	/**
	 * Raycaster
	 */
	raycaster.setFromCamera(mouse, camera)

	/**
	 * Laptop Screen Interaction
	 */
	if(interactionObjects.laptopScreen)
	{
		const intersection = raycaster.intersectObject(interactionObjects.laptopScreen)
		if(intersection.length > 0)
		{
			const uv = intersection[0].uv
			const uvCoord = {
				x: ((uv.x - 0.5) * 2),
				y: ((uv.y - 0.5) * 2),
			}

			laptopScreen.model.position.x += (- uvCoord.x * 0.2 - laptopScreen.model.position.x) * 0.05
			laptopScreen.model.position.y += (- uvCoord.y * 0.2 - laptopScreen.model.position.y) * 0.05

			laptopScreen.model.rotation.y += (- uvCoord.x * 0.3 - laptopScreen.model.rotation.y) * 0.04
			laptopScreen.model.rotation.x += (uvCoord.y * 0.2 - laptopScreen.model.rotation.x) * 0.02

			testRaycaster.setFromCamera(uvCoord, laptopScreen.camera)

			const testIntersections = testRaycaster.intersectObjects([
				laptopScreen.intersectObjects.SectionGroup.section_appearance,
				laptopScreen.intersectObjects.SectionGroup.section_event,
				laptopScreen.intersectObjects.SectionGroup.section_profile,
				laptopScreen.intersectObjects.textMission,

			])
			if(testIntersections.length > 0)
			{
				//laptopScreen.intersectObjects.TextBoxGroup.textBox_appearance.visible = true
				for(let key in laptopScreen.intersectObjects.TextBoxGroup)
				{
					laptopScreen.intersectObjects.TextBoxGroup[key].visible = true
				}

				document.body.style.cursor = 'pointer'
			}
			else{
				//laptopScreen.intersectObjects.TextBoxGroup.textBox_appearance.visible = false
				for(let key in laptopScreen.intersectObjects.TextBoxGroup)
				{
					laptopScreen.intersectObjects.TextBoxGroup[key].visible = false
				}
				document.body.style.cursor = 'default'

			}

			orbitControl.enableRotate = false
			//orbitControl.enableZoom = false
			//window.addEventListener('wheel', laptopWheelEvent)
		}
		else{
			laptopScreen.model.position.x += (0 - laptopScreen.model.position.x) * 0.05
			laptopScreen.model.position.y += (0 - laptopScreen.model.position.y) * 0.05
			laptopScreen.model.rotation.y += (0 - laptopScreen.model.rotation.y) * 0.04
			laptopScreen.model.rotation.x += (0 - laptopScreen.model.rotation.x) * 0.02

			orbitControl.enableRotate = true
			//orbitControl.enableZoom = true
			//window.removeEventListener('wheel', laptopWheelEvent )
		}
	}

	/**
	 * laptop screen animation
	 */
	if(Object.keys(laptopScreen.model).length != 0)
	{
		laptopScreen.intersectObjects.man.rotation.y = elapsedTime
		laptopScreen.intersectObjects.earth.geometry.rotateY(0.01)
		laptopScreen.intersectObjects.textMission.rotation.y = Math.sin(elapsedTime) * 0.1
		laptopScreen.intersectObjects.textMission.rotation.x = Math.sin(elapsedTime) * 0.1

		laptopScreen.intersectObjects.BarGroup.bar1.scale.x = Math.abs( Math.sin(elapsedTime*0.3 + 0) * Math.abs(Math.cos(elapsedTime * 0.5)) )
		laptopScreen.intersectObjects.BarGroup.bar2.scale.x = Math.abs( Math.sin(elapsedTime*0.2 + 1) * Math.abs(Math.cos(elapsedTime * 0.2 + 3)))
		laptopScreen.intersectObjects.BarGroup.bar3.scale.x = Math.abs( Math.sin(elapsedTime*0.5 + 2)) * 0.5 + 0.5
	}

	/**
	 * pointer interaction
	 */
	if(pointerInstancedMesh)
	{
		const intersection = raycaster.intersectObject(pointerInstancedMesh)

		if(intersection.length > 0)
		{
			const instancedId = intersection[ 0 ].instanceId

			// Color
			pointerInstancedMesh.setColorAt( instancedId, pointerActivateColor )
			pointerInstancedMesh.instanceColor.needsUpdate = true;

			if(!isMouseIn)
			{
				// Matrix
				pointerInstancedMesh.getMatrixAt(instancedId, pointerMatrix)
				pointerMatrix.multiply(scaleUpMatrix)
				pointerInstancedMesh.setMatrixAt(instancedId, pointerMatrix)
				pointerInstancedMesh.instanceMatrix.needsUpdate = true

				// Click Eventlistener
				pointerClickEventFunction = pointerCameraFocus(instancedId)
				window.addEventListener('click', pointerClickEventFunction)
			}

			isMouseIn = true
			document.body.style.cursor = 'pointer'
			prevPointerInstancedId = instancedId
		}
		else
		{
			if(prevPointerInstancedId !== null)
			{

				// Color
				pointerInstancedMesh.instanceColor.needsUpdate = true;
				pointerInstancedMesh.setColorAt( prevPointerInstancedId, pointerColor )
				pointerInstancedMesh.instanceColor.needsUpdate = true;

				if(isMouseIn)
				{
					// Matrix
					pointerInstancedMesh.getMatrixAt(prevPointerInstancedId, pointerMatrix)
					pointerMatrix.multiply(scaleDownMatrix)
					pointerInstancedMesh.setMatrixAt(prevPointerInstancedId, pointerMatrix)
					pointerInstancedMesh.instanceMatrix.needsUpdate = true

					// Click Eventlistener
					window.removeEventListener('click', pointerClickEventFunction)
				}

				isMouseIn = false
				document.body.style.cursor = 'default'
				prevPointerInstancedId = null
			}
		}

	}
	orbitControl.update()

	renderer.setRenderTarget(laptopScreen.renderTarget)
	renderer.render(laptopScreen.scene, laptopScreen.camera)
	//laptopScreen.effectComposer.render()
	renderer.setRenderTarget(null)
	renderer.render(scene, camera)
	//renderer2.render(scene2, camera)
	stats.end()
	window.requestAnimationFrame(tick)
}

tick()