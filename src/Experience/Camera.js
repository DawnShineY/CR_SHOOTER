import * as THREE from 'three'
import Experience from './Experience.js'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

export default class Camera
{
	constructor()
	{
		this.experience = new Experience()
		this.sizes = this.experience.sizes
		this.scene = this.experience.scene.instance
		this.canvas = this.experience.canvas

		this.setInstance()
		this.setControls()
		this.setControlLimit()
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
	}
	setControlLimit()
	{
		this.controls.maxPolarAngle = Math.PI / 2
		this.controls.minAzimuthAngle = 0
		this.controls.maxAzimuthAngle = Math.PI / 2
		this.controls.maxDistance = 80

		// Pan limitation
		const xRange = 4.4
		const yRange = 4.7
		const zRange = 4.6
		this.controls.addEventListener('change', () => {
			const t = this.controls.target;
			t.x = Math.max(-xRange, Math.min(xRange, t.x));
			t.y = Math.max(-yRange, Math.min(yRange, t.y));
			t.z = Math.max(-zRange, Math.min(zRange, t.z));
		});
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