import * as THREE from 'three'
import Experience from './Experience.js'

export default class Renderer
{
	constructor()
	{
		this.experience = new Experience()
		this.sizes = this.experience.sizes
		this.canvas = this.experience.canvas
		this.camera = this.experience.camera.instance
		this.scene = this.experience.scene.instance

		this.setRenderer()
	}
	setRenderer()
	{
		this.instance = new THREE.WebGLRenderer({
			canvas: this.canvas,
			antialias: true
		})
		this.instance.setSize( this.sizes.width, this.sizes.height )
		this.instance.setPixelRatio( this.sizes.pixelRatio )
		this.instance.outputColorSpace = THREE.SRGBColorSpace
	}
	update()
	{
		this.instance.render( this.scene, this.camera )
	}
	resize()
	{
		this.instance.setSize( this.sizes.width, this.sizes.height )
		this.instance.setPixelRatio( this.sizes.pixelRatio )
	}
}