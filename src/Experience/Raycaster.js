import * as THREE from 'three'
import Experience from './Experience';

export default class Raycaster{
	constructor()
	{
		this.experience = new Experience()
		this.time = this.experience.time
		this.sizes = this.experience.sizes
		this.camera = this.experience.camera.instance
		this.instance = new THREE.Raycaster()
		this.mouse = new THREE.Vector2( -999, -999 )
		this.canvas = this.experience.canvas

		this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
		this.eventType = this.isMobile ? 'click' : 'mousemove'

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