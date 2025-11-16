import Sizes from '@/Experience/Utils/Sizes.js'
import Time from '@/Experience/Utils/Time.js'
import Resources from '@/Experience/Utils/Resources.js'
import World from '@/Experience/World/World.js'
import Camera from '@/Experience/Camera.js'
import Renderer from '@/Experience/Renderer.js'
import Debug from '@/Experience/Utils/Debug.js'
import Raycaster from '@/Experience/Raycaster.js'
import Scene from '@/Experience/Scene.js'
import Landing from '@/Experience/Landing.js'
import Physics from '@/Experience/Physics.js'

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