import Experience from "./Experience"

export default class Landing
{
	constructor()
	{
		this.experience = new Experience()
		this.resources = this.experience.resources
		this.sizes = this.experience.sizes

		this.landingElement = document.querySelector('.landing')
		this.bulletElement = document.querySelector('.landing__bullet')
		this.gunElement = document.querySelector('.landing__gun')
		this.canElement = document.querySelector('.landing__can')
		this.subtitleElement = document.querySelector('.landing__subtitle')
		this.openingTopElement = document.querySelector('.landing__opening-top')
		this.openingBottomElement = document.querySelector('.landing__opening-bottom')
		this.landingBox = document.querySelector('.landing__box')

		this.setBulletInitialPosition()
		this.progressing()
	}
	setBulletInitialPosition()
	{
		this.gunBoundingRect = this.gunElement.getBoundingClientRect()
		this.bulletLeft = this.gunBoundingRect.width + this.gunBoundingRect.left
		this.bulletTop = this.gunBoundingRect.top + this.gunBoundingRect.height * 0.267

		this.bulletElement.style.opacity = 1
		this.bulletElement.style.left = `${this.bulletLeft + 4}px`
		this.bulletElement.style.top = `${this.bulletTop}px`
	}
	progressing()
	{
		const canLeft = this.canElement.getBoundingClientRect().left
		const bulletPathLength = canLeft - this.bulletLeft
		const bulletSize = this.bulletElement.clientWidth

		this.resources.on('progress', ( url, itemLoaded, itemsTotal ) =>
		{
			this.bulletElement.style.transform = `translateX(calc(${bulletPathLength - bulletSize}px / ${itemsTotal} * ${itemLoaded}))`

		})

		this.resources.on('ready', () =>
		{
			this.canElement.style.backgroundImage = `url('/images/landing/img_can_active.png')`
			this.openingTopElement.style.transform = 'translateY(-49%)'
			this.openingBottomElement.style.transform = 'translateY(49%)'
			this.landingElement.style.opacity = 0

			window.setTimeout(() =>
			{
				this.subtitleElement.innerHTML = 'complete'
			}, 1000)
			window.setTimeout(() =>
			{
				this.landingElement.style.display = 'none'
			}, 5000)
		})
	}
}