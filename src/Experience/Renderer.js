import { WebGLRenderer, SRGBColorSpace } from 'three'
import Experience from '@/Experience/Experience.js'

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
		this.instance = new WebGLRenderer({
			canvas: this.canvas,
			antialias: true
		})
		this.instance.setSize( this.sizes.width, this.sizes.height )
		this.instance.setPixelRatio( this.sizes.pixelRatio )
		this.instance.outputColorSpace = SRGBColorSpace
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