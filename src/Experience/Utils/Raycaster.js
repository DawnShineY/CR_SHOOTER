import * as THREE from 'three'
import EventEmitter from "./EventEmitter";
import Experience from '../Experience';

export default class Raycaster extends EventEmitter{
	constructor()
	{
		super()

		this.experience = new Experience()
		this.time = this.experience.time
		this.sizes = this.experience.sizes
		this.camera = this.experience.camera.instance
		this.instance = new THREE.Raycaster()
		this.mouse = new THREE.Vector2( -999, -999 )

		this.setMouse()
	}

	setMouse()
	{
		window.addEventListener('mousemove', ( event ) =>
		{
			this.mouse.x = event.clientX / this.sizes.width * 2 - 1
			this.mouse.y = - ( event.clientY / this.sizes.height ) * 2 + 1
		})
	}

	update()
	{
		// Default mouse setting
		this.instance.setFromCamera( this.mouse, this.camera )

		this.trigger( 'tick' )
	}
}