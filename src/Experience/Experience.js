import * as THREE from 'three'
import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Resources from './Utils/Resources.js'
import World from './World/World.js'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import Debug from './Utils/Debug.js'
import Raycaster from './Raycaster.js'
import Scene from './Scene.js'
import Landing from './Landing.js'
import Physics from './Physics.js'

function isMobileDevice() {
  const userAgent = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const screen = window.innerWidth <= 768;

  return userAgent || (touch && screen);
}

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
		this.isMobile = isMobileDevice()

		// Options
		this.canvas = _canvas
		this.debug = new Debug()
		this.sizes = new Sizes()
		this.time = new Time()
		this.scene = new Scene()
		this.resources = new Resources()
		this.landing = new Landing()
		this.camera = new Camera()
		this.renderer = new Renderer()
		this.world = new World()
		this.raycaster = new Raycaster()
		this.physics = new Physics()

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
		this.camera.update()
		this.raycaster.update()
		this.renderer.update()
		this.world.update() // css3DRenderer가 webGLRenderer보다 나중에 실행되어야함
		this.physics.update()
	}
	resize()
	{
		this.camera.resize()
		this.renderer.resize()
		this.world.resize()
	}
}