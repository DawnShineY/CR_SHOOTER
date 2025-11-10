import * as THREE from 'three'
import Experience from '../../../../Experience.js'
import CANNON from 'cannon'
import Interaction from '../Interaction.js'

export default class Can
{
	constructor(_interactionObjects)
	{
		this.interactionObjects = _interactionObjects
		this.model = this.interactionObjects.can
		this.modelShadow = this.interactionObjects.canShadow
		this.canHeight = 0.498234
		this.canRadius = 0.377429 / 2
		this.isFocused = false
		this.isMouseIn = false
		this.canOriginPosition = [ 0.288211, 1.58473, 1.1656 ]

		this.clickEvent = this.setClickEvent.bind(this)

		this.experience = new Experience()
		this.resources = this.experience.resources
		this.scene = this.experience.scene.instance
		this.modelGroup = this.experience.scene.modelGroup
		this.raycaster = this.experience.raycaster
		this.canvas = this.experience.canvas
		this.time = this.experience.time
		this.debug = this.experience.debug
		this.sizes = this.experience.sizes

		this.interaction = new Interaction()
		this.pointer = this.interaction.pointer
		this.setPointerEvent()

		if(this.debug.active)
		{
			this.debug.ui.add(this.model.position, 'x').min(-10).max(10).step(0.001)
			this.debug.ui.add(this.model.position, 'y').min(-10).max(10).step(0.001)
			this.debug.ui.add(this.model.position, 'z').min(-10).max(10).step(0.001)

			this.debug.ui.add(this.model.rotation, 'x').min(-10).max(10).step(0.001)
			this.debug.ui.add(this.model.rotation, 'y').min(-10).max(10).step(0.001)
			this.debug.ui.add(this.model.rotation, 'z').min(-10).max(10).step(0.001)
		}

		//this.setTable()
		this.setGeometryAxis()
		this.setShadow()
		this.setPhysics()
		this.setScope()
	}

	setScope()
	{
		const scopeGeometry = new THREE.PlaneGeometry(2, 2, 1, 1)
		this.scopeMaterial = new THREE.ShaderMaterial({
			//wireframe: true,
			transparent: true,
			//alphaMap: this.modelShadow,
			uniforms: {
				uAlphaMap: { value: this.shadowOpacityTexture},
				uPointer: { value: new THREE.Vector2(1, 1)},
				uAspectRatio: { value: this.sizes.aspectRatio },
				uSize: { value: 0.38 },
				uTime: { value: 0 }
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

					float strength = step(0.5, distance(newUv, vec2(0.5 * uAspectRatio, 0.5)) + uSize) - 0.1;

					float colorIntensity = abs(sin(uTime * 2.0)) - 0.8;

					gl_FragColor = vec4(colorIntensity, 0.0, 0.0, strength);
				}
			`
		})

		const scopeMesh = new THREE.Mesh( scopeGeometry, this.scopeMaterial )
		this.scene.add(scopeMesh)
	}

	setPointerEvent()
	{
		this.pointer.on('reset', () =>
		{
			const [ x, y, z ] = this.canOriginPosition
			this.canBody.position.set(x, y, z)
			this.canBody.quaternion.setFromEuler(0,0, 0)
		})
	}
	setClickEvent()
	{
		const intersection = this.intersection
		console.log(intersection)
		const hitObject = intersection[0]
		const hitPoint = hitObject.point
		const hitNormal = this.raycaster.instance.ray.direction
		const forceScale = -1
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
	}
	updateRaycaster()
	{
		this.intersection = this.raycaster.instance.intersectObject( this.model )
		if(this.intersection.length > 0)
		{
			this.isFocused = true
			if(!this.isMouseIn)
			{
				this.canvas.addEventListener('click', this.clickEvent)
			}
			this.isMouseIn = true
		}
		else {
			this.canvas.removeEventListener('click', this.clickEvent)
			this.canvas.classList.add('canvas_scope')

			this.isFocused = false
			this.isMouseIn = false
		}
	}
	setPhysics()
	{
		/**
		 * World
		 */
		this.world = new CANNON.World()
		this.world.gravity.set(0, -9.82, 0)
		this.world.broadphase = new CANNON.SAPBroadphase(this.world)
		this.world.allowSleep = true
		/**
		 * Material
		 */
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
		this.world.addContactMaterial(woodCanContactMaterial)
		/**
		 * Object
		 */
		const tableShape = new CANNON.Box(new CANNON.Vec3(4.21 * 0.5, 0.881* 0.5, 2.13* 0.5))
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

		const chairShape = new CANNON.Box(new CANNON.Vec3(1.3765 * 0.5, 1.86539 * 0.5, 1.3765* 0.5))
		this.chairBody = new CANNON.Body({
			mass: 0,
			position: new CANNON.Vec3(-1.72985, 1.37714, 1.4792 ),
			shape: chairShape,
			material: woodMaterial
		})
		this.chairBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 9)

		const canShape = new CANNON.Cylinder(this.canRadius, this.canRadius, this.canHeight, 12)
		const quat = new CANNON.Quaternion();
		quat.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2); // X축 기준 90도 회전
		canShape.transformAllPoints(new CANNON.Vec3(), quat);

		this.canBody = new CANNON.Body({
			mass: 3,
			position: new CANNON.Vec3(0.288211, 1.58473, 1.1656),
			shape: canShape,
			material: canMaterial
		})

		this.world.addBody(this.tableBody)
		this.world.addBody(this.canBody)
		this.world.addBody(this.floorBody)
		this.world.addBody(this.chairBody)
	}
	setTable()
	{
		this.tableGeometry = new THREE.BoxGeometry(4.21, 0.881, 2.13)
		this.tableMateria = new THREE.MeshBasicMaterial({ color: 'red' })
		this.table = new THREE.Mesh(this.tableGeometry, this.tableMateria)
		this.table.position.set(1.551, 0.8796, 0.70513)

		this.canGeometry = new THREE.CylinderGeometry(this.canRadius, this.canRadius, this.canHeight, 12, 1)
		this.can = new THREE.Mesh(this.canGeometry, this.tableMateria)
		this.can.position.set(0.288211, 1.58473, 1.1656)

		this.chair = new THREE.Mesh(
			new THREE.BoxGeometry(1.3765, 1.86539, 1.3765),
			this.tableMateria
		)
		this.modelGroup.add(this.table, this.chair, this.can)
	}

	setShadow()
	{
		this.shadowOpacityTexture = this.resources.items.canShadowOpacityTexture
		this.shadowOpacityTexture.flipY = false

		this.modelShadow.material = new THREE.MeshBasicMaterial({
			color: '#000000',
			transparent: true,
			alphaMap: this.shadowOpacityTexture
		})
		this.modelShadow.visible = false
	}
	setGeometryAxis()
	{
		this.model.geometry.translate(0, -this.canHeight / 2, 0)
		this.model.geometry.rotateY( - Math.PI * 2 / 3)
	}
	updatePhysics()
	{
	}

	resize()
	{
		this.scopeMaterial.uniforms.uAspectRatio.value = this.sizes.aspectRatio
	}
	update()
	{
		this.scopeMaterial.uniforms.uPointer.value = new THREE.Vector2(
			this.raycaster.mouse.x,
			this.raycaster.mouse.y
		)
		this.scopeMaterial.uniforms.uTime.value = this.isFocused ? this.time.elapsed : 0

		this.updateRaycaster()
		this.world.step( 1 / 60, this.time.delta, 3)
		this.model.position.copy(this.canBody.position)
		this.model.quaternion.copy(this.canBody.quaternion)

	}
}