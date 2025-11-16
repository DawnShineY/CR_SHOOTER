import { Raycaster, Vector2 } from 'three'
import Experience from '@/Experience/Experience.js';

export default class RaycasterManager{
	constructor()
	{
		this.experience = new Experience()
		this.time = this.experience.time
		this.sizes = this.experience.sizes
		this.camera = this.experience.camera.instance
		this.instance = new Raycaster()
		this.mouse = new Vector2( -999, -999 )
		this.canvas = this.experience.canvas
		this.isMobile = this.sizes.isMobile

		this.eventType = this.isMobile ? 'pointerup' : 'mousemove'

		this.setMouse()
	}

	setMouse()
	{
		this.canvas.addEventListener(this.eventType, ( event ) =>
		{
			event.preventDefault()

			this.mouse.x = event.clientX / this.sizes.width * 2 - 1
			this.mouse.y = - ( event.clientY / this.sizes.height ) * 2 + 1
		}, {
			passive: false
		})
	}

	update()
	{
		// Default mouse setting
		this.instance.setFromCamera( this.mouse, this.camera )
	}
}