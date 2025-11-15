import * as THREE from 'three'
import Experience from '../../../../Experience.js'
import CANNON from 'cannon'
import Interaction from '../Interaction.js'
import gsap from 'gsap'
import pointerIndex from '../../../../Data/pointerIndex.js'

export default class Can
{
	constructor(_interactionObjects)
	{
		this.interactionObjects = _interactionObjects
		this.model = this.interactionObjects.can
		this.modelShadow = this.interactionObjects.canShadow
		this.modelOriginPosition = {...this.model.position}
		this.modelHeight = 0.49823370575904846
		this.modelRadius = 0.3774030804634094 / 2
		this.isReady = false // step 1
		this.isFocused = false // step 2
		this.isShotted = false // step 3
		this.clickEvent = this.setClickEvent.bind(this)

		this.experience = new Experience()
		this.resources = this.experience.resources
		this.scene = this.experience.scene.instance
		this.modelGroup = this.experience.scene.modelGroup
		this.raycaster = this.experience.raycaster
		this.physics = this.experience.physics
		this.canvas = this.experience.canvas
		this.time = this.experience.time
		this.debug = this.experience.debug
		this.sizes = this.experience.sizes
		this.camera = this.experience.camera

		this.interaction = new Interaction()
		this.pointer = this.interaction.pointer
		this.gun = this.interaction.gun

		this.setShadow()
		this.setPhysics()
		this.setMissionBrief()
		this.setScopeMesh()

		this.utilityElement = document.querySelector('#utilityGroup')
		this.posterBtnWrapElement = document.querySelector('#posterBtnWrap')
		this.missionCompleteElement = document.querySelector('#missionComplete')
	}

	/**
	 * Step 0. default setting
	 */
	setShadow()
	{
		this.shadowOpacityTexture = this.resources.items.canShadowOpacityTexture
		this.shadowOpacityTexture.flipY = false

		this.modelShadow.material = new THREE.MeshBasicMaterial({
			color: '#000000',
			transparent: true,
			alphaMap: this.shadowOpacityTexture,
			depthWrite: false,
			side: THREE.DoubleSide,
		})
	}

	setMissionBrief()
	{
		this.missionElement = document.querySelector('#mission')
		this.missionBtnElement = document.querySelector('#missionBtn')
		this.missionBtnElement.addEventListener('click', () =>
		{
			if(!this.isReady)
			{
				this.gun.startMission()
				this.startMission()
				this.utilityElement.style.display = 'none'
				this.missionBtnElement.style.pointerEvents = 'none'

				setTimeout(()=>
				{
					this.missionBtnElement.innerHTML = "QUIT MISSION"
					this.missionBtnElement.style.pointerEvents = 'all'
				}, 2000)
			}
			else
			{
				this.resetAssets()
				this.missionBtnElement.style.pointerEvents = 'none'
				setTimeout(()=>
				{
					this.missionBtnElement.innerHTML = "ACCEPT MISSION"
					this.missionBtnElement.style.pointerEvents = 'all'
				}, 1000)
			}
		})

		const missionToggleBtnElement = document.querySelector('#missionToggleBtn')
		missionToggleBtnElement.addEventListener('click', () =>
		{
			if(this.missionElement.classList.contains('mission-closed'))
			{
				this.missionElement.classList.remove('mission-closed')
			}
			else
			{
				this.missionElement.classList.add('mission-closed')
			}
		})
	}
	setScopeMesh()
	{
		const scopeGeometry = new THREE.PlaneGeometry(2, 2, 1, 1)
		this.scopeMaterial = new THREE.ShaderMaterial({
			transparent: true,
			depthWrite: false,
			uniforms: {
				uAlphaMap: { value: this.shadowOpacityTexture},
				uPointer: { value: new THREE.Vector2(1, 1)},
				uAspectRatio: { value: this.sizes.aspectRatio },
				uSize: { value: 0 },
				uTime: { value: 0 },
			},
			vertexShader: `
				varying vec2 vUv;

				void main()
				{
					vUv = uv;
					gl_Position = vec4(position, 1.0);
				}
			`,
			fragmentShader: `
				uniform sampler2D uAlphaMap;
				varying vec2 vUv;
				uniform vec2 uPointer;
				uniform float uAspectRatio;
				uniform float uSize;
				uniform float uTime;
				void main()
				{
					vec2 newUv = vUv;
					newUv.x *= uAspectRatio;
					newUv.x -= uPointer.x * uAspectRatio / 2.0;
					newUv.y -= uPointer.y / 2.0;

					float strength = step(0.5, distance(newUv, vec2(0.5 * uAspectRatio, 0.5)) + 0.5 - uSize) - 0.2;
					float colorIntensity = abs(sin(uTime * 2.0)) - 0.8;

					gl_FragColor = vec4(colorIntensity, 0.0, 0.0, strength);
				}
			`
		})
		this.scopeMesh = new THREE.Mesh( scopeGeometry, this.scopeMaterial )
	}

	/**
	 * Step 1. ready
	 */
	startMission()
	{
		this.setStartCameraPosition()
		this.camera.controls.enabled = false
		this.pointer.instancedMesh.visible = false
		this.posterBtnWrapElement.style.display = 'none'
		this.posterBtnWrapElement.classList.remove('active')
		setTimeout(() =>
		{
			this.isReady = true
			this.isShotted = false
			this.setPlayingCameraPosition()
			this.setScope()
		}, 2000)
	}

	setPlayingCameraPosition()
	{
		this.camera.instance.fov = 45
		this.camera.instance.updateProjectionMatrix()
		this.camera.instance.position.set(10.95210208983665, 5.533408998183908, 14.055720006103275)
		this.camera.controls.target.set(1.037373571184411, -0.06867062842241968, 1.7896552928057428)
	}
	setScope()
	{
		this.canvas.classList.add('canvas_scope')
		this.scopeMaterial.uniforms.uAspectRatio.value = this.sizes.aspectRatio
		this.scene.add(this.scopeMesh)
		gsap.to(
			this.scopeMaterial.uniforms.uSize,
			{
				value: 0.12,
				duration: 1,
				ease: 'power2.inOut'
			}
		)
	}

	/**
	 * Step 2. Focused
	 */
	updateRaycaster()
	{
		this.intersection = this.raycaster.instance.intersectObject( this.model )
		if(this.intersection.length > 0)
		{
			if(!this.isFocused)
			{
				this.canvas.addEventListener('click', this.clickEvent)
			}
			this.isFocused = true
		}
		else
		{
			this.canvas.removeEventListener('click', this.clickEvent)
			this.isFocused = false
		}
	}
	setClickEvent()
	{
		this.modelShadow.visible = false

		// raycaster
		const hitObject = this.intersection[0]
		const hitPoint = hitObject.point
		const hitNormal = this.raycaster.instance.ray.direction
		const forceScale = -1.8

		// physics
		this.canBody.wakeUp()
		this.canBody.applyImpulse(
			new CANNON.Vec3(
				hitNormal.x * forceScale,
				hitNormal.y * forceScale,
				hitNormal.z * forceScale
			),
			new CANNON.Vec3(
				hitPoint.x,
				hitPoint.y,
				hitPoint.z
			)
		)

		// reset to origin status
		this.setMissionComplete()
		this.isShotted = true
		this.isFocused = false
		this.canvas.removeEventListener('click', this.clickEvent)
	}
	setPhysics()
	{
		// material
		const woodMaterial = new CANNON.Material('wood')
		const canMaterial = new CANNON.Material('can')
		const woodCanContactMaterial = new CANNON.ContactMaterial(
			woodMaterial,
			canMaterial,
			{
				friction: 0.3,
				restitution: 0.5
			}
		)
		this.physics.world.addContactMaterial(woodCanContactMaterial)

		// body
		const tableShape = new CANNON.Box(new CANNON.Vec3(4.21 * 0.5, 0.891849 * 0.5, 2.13* 0.5))
		this.tableBody = new CANNON.Body({
			mass: 0,
			position: new CANNON.Vec3(1.551, 0.8796, 0.70513),
			shape: tableShape,
			material: woodMaterial
		})

		const floorShape = new CANNON.Plane()
		this.floorBody = new CANNON.Body({
			mass: 0,
			position: new CANNON.Vec3(0, 0.447641, 0),
			shape: floorShape,
			material: woodMaterial
		})
		this.floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(- 1, 0, 0), Math.PI * 0.5)

		const chairShape = new CANNON.Box(new CANNON.Vec3(1.49751 * 0.5, 1.31804 * 0.5, 1.16305 * 0.5))
		this.chairBody = new CANNON.Body({
			mass: 0,
			position: new CANNON.Vec3(-3.51072, 1.09705, -1.05658  ),
			shape: chairShape,
			material: woodMaterial
		})

		const lockerShape = new CANNON.Box(new CANNON.Vec3(2.13653 * 0.5, 3.55027 * 0.5,0.850227 * 0.5))
		this.lockerBody = new CANNON.Body({
			mass: 0,
			position: new CANNON.Vec3(-3.15998, 2.20919, -3.16247),
			shape: lockerShape,
			material: woodMaterial
		})

		const canShape = new CANNON.Cylinder(this.modelRadius, this.modelRadius, this.modelHeight, 12)
		const quat = new CANNON.Quaternion();
		quat.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2);
		canShape.transformAllPoints(new CANNON.Vec3(), quat);
		const {x, y, z} = this.modelOriginPosition
		this.canBody = new CANNON.Body({
			mass: 3,
			position: new CANNON.Vec3(x, y, z),
			shape: canShape,
			material: canMaterial
		})

		this.canBody.quaternion.setFromEuler(0, -Math.PI * 2 / 3, 0);
		this.physics.world.addBody(this.tableBody)
		this.physics.world.addBody(this.canBody)
		this.physics.world.addBody(this.floorBody)
		this.physics.world.addBody(this.chairBody)
		this.physics.world.addBody(this.lockerBody)
	}

	/**
	 * Reset Utils
	 */
	resetModelTransform()
	{
		// can
		const {x, y, z} = this.modelOriginPosition
		this.model.position.set(x, y, z)
		this.model.rotation.set(0, - Math.PI * 2 / 3, 0)
		this.canBody.position.set(x, y, z)
		this.canBody.quaternion.setFromEuler(0, -Math.PI * 2 / 3, 0);
		this.modelShadow.visible = true

		// gun
		this.gun.model.visible = true
		this.gun.model.position.set(
			this.gun.modelOriginPosition.x,
			this.gun.modelOriginPosition.y,
			this.gun.modelOriginPosition.z,
		)
		this.gun.model.rotation.set(
			this.gun.modelOriginRotation.x,
			this.gun.modelOriginRotation.y,
			this.gun.modelOriginRotation.z,
		)
		this.gun.modelShadow.visible = true
	}
	resetAssets()
	{
		// status
		this.isReady = false
		this.isShotted = false
		this.isFocused = false

		// camera
		this.camera.instance.fov = 15
		this.camera.instance.updateProjectionMatrix()
		this.camera.controls.enabled = true
		this.setStartCameraPosition()

		// objects
		this.pointer.instancedMesh.visible = true
		this.resetModelTransform()


		// html
		this.canvas.classList.remove('canvas_scope')
		this.utilityElement.style.display = 'flex'
		this.missionBtnElement.innerHTML = "ACCEPT MISSION"
		this.resetMissionComplete()
		this.hideMissionBrief()

		gsap.to(
			this.scopeMaterial.uniforms.uSize,
			{
				value: this.sizes.aspectRatio + 1,
				duration: 2,
				ease: 'power2.inOut',
				onComplete: () =>
				{
					this.scopeMaterial.uniforms.uSize.value = 0
					this.scene.remove(this.scopeMesh)
				}
			}
		)
	}
	resetMissionComplete()
	{
		this.missionCompleteElement.style.transform = `translate(-50%, 100%)`
		setTimeout(() =>
		{
			this.missionCompleteElement.style.display = 'none'
		}, 2000)
	}

	/**
	 * Utils
	 */
	setStartCameraPosition()
	{
		const cameraPosition = pointerIndex[ 7 ].cameraPosition
		const controlTarget = pointerIndex[ 7 ].controlTarget
		this.pointer.moveCameraToTarget(cameraPosition, controlTarget)
	}
	showMissionBrief()
	{
		this.missionElement.style.display = 'block'
		requestAnimationFrame(() =>
		{
			this.missionElement.classList.remove('mission-closed')
		})
	}
	hideMissionBrief()
	{
		this.missionElement.classList.add('mission-closed')
	}
	setMissionComplete()
	{
		this.missionCompleteElement.style.display = 'block'
		requestAnimationFrame(() =>
		{
			this.missionCompleteElement.style.transform = `translate(-50%, -200%)`
		})
	}
	isBodyStopped()
	{
		const velocity = this.canBody.velocity.length()
		const angularVelocity = this.canBody.angularVelocity.length()

		return velocity < 0.01 && angularVelocity < 0.01
	}

	/**
	 * Resize & Update
	 */
	resize()
	{
		if(this.isReady)
		{
			this.scopeMaterial.uniforms.uAspectRatio.value = this.sizes.aspectRatio
		}
	}

	update()
	{
		if(this.isReady)
		{
			if(this.isShotted)
			{
				if(this.isBodyStopped())
				{
					this.resetAssets()
				}
				else
				{
					this.model.position.copy(this.canBody.position)
					this.model.quaternion.copy(this.canBody.quaternion)
				}
			}
			else
			{
				this.updateRaycaster()
			}
			this.scopeMaterial.uniforms.uPointer.value = new THREE.Vector2( this.raycaster.mouse.x, this.raycaster.mouse.y )
			this.scopeMaterial.uniforms.uTime.value = this.isFocused ? this.time.elapsed : 0
		}
	}
}