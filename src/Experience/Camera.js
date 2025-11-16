import { PerspectiveCamera, } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Experience from '@/Experience/Experience.js'

export default class Camera
{
	constructor()
	{
		this.experience = new Experience()
		this.sizes = this.experience.sizes
		this.scene = this.experience.scene.instance
		this.canvas = this.experience.canvas
		this.debug = this.experience.debug
		this.setPanLimitEvent = this.setPanLimit.bind(this)

		this.setInstance()
		this.setControls()
		this.setControlLimits()

		if(this.debug.active)
		{
			this.debug.ui.add(this.instance.position, 'x').min(-100).max(100).step(1)
			this.debug.ui.add(this.instance.position, 'y').min(-100).max(100).step(1)
			this.debug.ui.add(this.instance.position, 'z').min(-100).max(100).step(1)
		}
	}
	setInstance()
	{
		this.instance = new PerspectiveCamera( 15, this.sizes.aspectRatio, 1, 100 )
		this.instance.position.set( 38, 13, 35 )
		this.scene.add (this.instance )

	}
	setControls()
	{
		this.controls = new OrbitControls( this.instance, this.canvas )
		this.controls.enableDamping = true
	}
	setControlLimits()
	{
		this.controls.maxPolarAngle = Math.PI / 2
		this.controls.minAzimuthAngle = 0
		this.controls.maxAzimuthAngle = Math.PI / 2
		this.controls.maxDistance = 80

		// Pan limitation
		this.controls.addEventListener('change', this.setPanLimitEvent);
	}
	resetControlLimits() {
		this.controls.maxPolarAngle = Math.PI
		this.controls.minAzimuthAngle = -Infinity
		this.controls.maxAzimuthAngle = Infinity
		this.controls.maxDistance = Infinity
		this.controls.removeEventListener('change', this.setPanLimitEvent);
	}
	setPanLimit()
	{
		const xRange = 3
		const yRange = 5
		const zRange = 2
		const t = this.controls.target;
		t.x = Math.max(-xRange, Math.min(xRange, t.x));
		t.y = Math.max(-yRange, Math.min(yRange, t.y));
		t.z = Math.max(-zRange, Math.min(zRange, t.z));
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