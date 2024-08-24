import * as THREE from 'three'
import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Resources from './Utils/Resources.js'
import World from './World/World.js'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import Debug from './Utils/Debug.js'
import Raycaster from './Utils/Raycaster.js'
import Scene from './Scene.js'

let instance = null

export default class Experience
{
	constructor(_canvas)
	{
		// Singleton
		if(instance)
			return instance

		instance = this

		window.experience = this

		// Options
		this.canvas = _canvas
		this.debug = new Debug()
		this.sizes = new Sizes()
		this.time = new Time()
		this.resources = new Resources()
		this.scene = new Scene().instance
		this.camera = new Camera()
		this.renderer = new Renderer()
		this.world = new World()
		this.raycaster = new Raycaster()

		this.time.on('tick', () =>
		{
			this.update()
		})
		this.sizes.on('resize', () =>
		{
			this.resize()
		})
	}

	update()
	{
		this.world.update()
		this.camera.update()
		this.renderer.update()
		this.raycaster.update()
	}
	resize()
	{
		this.camera.resize()
		this.renderer.resize()
	}
}