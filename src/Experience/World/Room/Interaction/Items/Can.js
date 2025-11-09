import * as THREE from 'three'
import Experience from '../../../../Experience.js'
import CANNON from 'cannon'

export default class Can
{
	constructor(_interactionObjects)
	{
		this.interactionObjects = _interactionObjects
		this.model = this.interactionObjects.can
		this.modelShadow = this.interactionObjects.canShadow
		this.canHeight = 0.498234
		this.canRadius = 0.377429 / 2



		this.experience = new Experience()
		this.resources = this.experience.resources
		this.scene = this.experience.scene.instance
		this.modelGroup = this.experience.scene.modelGroup
		this.raycaster = this.experience.raycaster

		this.time = this.experience.time
		this.debug = this.experience.debug

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
	}
	updateRaycaster()
	{
		const intersection = this.raycaster.instance.intersectObject( this.model )
		if(intersection.length > 0)
		{
			console.log('can!')
		}

	}
	setPhysics()
	{
		/**
		 * World
		 */
		this.world = new CANNON.World()
		this.world.gravity.set(0, -9.82, 0)

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
			position: new CANNON.Vec3(0.288211, 1.58473 +5, 1.1656),
			shape: canShape,
			material: canMaterial
		})

		this.world.addBody(this.tableBody)
		this.world.addBody(this.canBody)
		this.world.addBody(this.floorBody)
		this.world.addBody(this.chairBody)

		//this.canBody.applyLocalForce(new CANNON.Vec3(-5, 1.58473, -25), new CANNON.Vec3(0.288211, 1.58473, 1.1656))
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

	update()
	{
		this.world.step( 1 / 60, this.time.delta, 3)
		this.model.position.copy(this.canBody.position)
		this.model.quaternion.copy(this.canBody.quaternion)

		this.updateRaycaster()
	}
}