import EventEmitter from './EventEmitter.js'

export default class Sizes extends EventEmitter
{
	constructor()
	{
		super()

		this.width = window.innerWidth
		this.height = window.innerHeight
		this.aspectRatio = this.width / this.height
		this.pixelRatio = Math.min( window.devicePixelRatio, 2 )
		this.isMobile = this.isMobileDevice()

		window.addEventListener('resize', () =>
		{
			this.width = window.innerWidth
			this.height = window.innerHeight
			this.aspectRatio = this.width / this.height
			this.pixelRatio = Math.min( window.devicePixelRatio, 2 )
			this.isMobile = this.isMobileDevice()

			this.trigger( 'resize' )
		})
	}

	isMobileDevice()
	{
		const userAgent = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
		const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
		const screen = this.width <= 768;

		return userAgent || (touch && screen);
	}
}