import * as THREE from 'three'
import Experience from './Experience.js'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

export default class Camera
{
	constructor()
	{
		this.experience = new Experience()
		this.sizes = this.experience.sizes
		this.scene = this.experience.scene
		this.canvas = this.experience.canvas

		this.setInstance()
		this.setControls()
	}
	setInstance()
	{
		this.instance = new THREE.PerspectiveCamera( 15, this.sizes.aspectRatio, 1, 100 )
		this.instance.position.set( 38, 13, 35 )
		this.scene.add (this.instance )

	}
	setControls()
	{
		this.controls = new OrbitControls( this.instance, this.canvas )
		this.controls.enableDamping = true
		this.setControlLimit()
	}
	setControlLimit()
	{
		this.controls.maxPolarAngle = Math.PI / 2
		this.controls.minAzimuthAngle = 0
		this.controls.maxAzimuthAngle = Math.PI / 2
		this.controls.maxDistance = 80
	}

	update()
	{
		this.controls.update()
	}
	resize()
	{
		this.instance.aspect = this.sizes.aspectRatio
		this.instance.updateProjectionMatrix()
	}

}