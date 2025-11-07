import Experience from "./Experience"

export default class Landing
{
	constructor()
	{
		this.experience = new Experience()
		this.resources = this.experience.resources
		this.sizes = this.experience.sizes
		console.log('ㅜㅜㅜㅜ')

		this.landingElement = document.querySelector('.landing')
		this.bulletElement = document.querySelector('.landing__bullet')
		this.bulletLineElement = document.querySelector('.landing__bullet_line')
		this.canElement = document.querySelector('.landing__can')
		this.subtitleElement = document.querySelector('.landing__subtitle')
		this.openingTopElement = document.querySelector('.landing__opening-top')
		this.openingBottomElement = document.querySelector('.landing__opening-bottom')
		this.landingBox = document.querySelector('.landing__box')

		this.landingElement.addEventListener('transitionend', (e) =>
		{
			if(e.target === this.landingElement)
			{
				this.landingElement.style.display = 'none'
			}
		})

		this.progressing()
	}
	progressing()
	{
		this.resources.on('progress', ( url, itemLoaded, itemsTotal ) =>
		{
			const progress = itemLoaded / itemsTotal
			this.bulletElement.style.opacity = 1
			this.bulletElement.style.transform = `translateX(${progress * 100}%)`
			this.bulletLineElement.style.transform = `scaleX(${progress})`
		})

		this.resources.on('ready', () =>
		{
			this.canElement.style.backgroundImage = `url('/images/landing/img_can_active.png')`
			this.openingTopElement.style.transform = 'translateY(-49%)'
			this.openingBottomElement.style.transform = 'translateY(49%)'
			this.landingElement.style.opacity = 0

			this.canElement.addEventListener('transitionend', () =>
			{
				this.subtitleElement.innerHTML = 'complete'
			})
		})
	}
}