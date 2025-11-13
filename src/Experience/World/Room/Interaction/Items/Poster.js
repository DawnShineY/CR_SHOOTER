import * as THREE from 'three'
import Experience from '../../../../Experience.js'
import Interaction from '../Interaction.js'
import gsap from 'gsap'

export default class Poster
{
	constructor()
	{
		this.experience = new Experience()
		this.camera = this.experience.camera
		this.sizes = this.experience.sizes
		this.scene = this.experience.scene
		this.timeDelta = this.experience.time.delta

		this.isPosterPageActive = false
		this.posterBtnWrapElement = document.querySelector('#posterBtnWrap')
		this.posterClsBtnElement = document.querySelector('#posterClsBtn')
		this.posterContainer = document.querySelector('#posterContainer')
		this.utilityGroup = document.querySelector('#utilityGroup')
		this.missionELement = document.querySelector('#mission')
		this.posterContainerHeight = this.posterContainer.clientHeight
		this.posterScrollHeight = this.posterContainerHeight - this.sizes.height
		this.bodyElement = document.body
		this.bodyElement.style.height = `${this.posterContainerHeight}px`
		this.posterScrollY = 0
		this.posterCurrentY = 0
		this.movingTime = 1.5
		this.setHidePosterPage()
		this.setPosterScrollEvent()
		this.setPosterBtnClickEvent()
		this.setCloseBtnClickEvent()

		this.interaction = new Interaction()
		this.pointer = this.interaction.pointer
		this.setPointerEvent()
		this.resetPointerEvent()

	}
	setPointerEvent()
	{
		this.pointer.on('click', (obj) =>
		{
			if(obj === 'poster')
			{
				this.posterBtnWrapElement.style.display = 'block'
				setTimeout(() =>
				{
					this.posterBtnWrapElement.classList.add('active')
				}, 0)
			}
		})
	}
	resetPointerEvent()
	{
		this.pointer.on('reset', () =>
		{
			this.hidePosterBtn()
		})
	}

	/**
	 * Poster Button
	 */
	setPosterBtnClickEvent()
	{
		this.posterBtn = document.querySelector('#posterBtn')
		this.posterBtn.addEventListener('click', () =>
		{
			this.camera.controls.enabled = false
			this.camera.resetControlLimits()

			gsap.to(
				this.camera.instance.position,
				{
					x: 56,
					y: 4,
					z: 52,
					duration: this.movingTime
				}
			)
			gsap.to(
				this.camera.controls.target,
				{
					x: 3,
					y: -15,
					z: 3,
					duration: this.movingTime
				}
			)

			setTimeout(() =>
			{
				this.scene.instance.visible = false
			}, this.movingTime * 1000)

			this.showPosterPage(this.movingTime)
		})
	}
	setCloseBtnClickEvent()
	{
		this.posterClsBtnElement.addEventListener('click', () =>{
			this.hidePosterBtn()
		})
	}
	hidePosterBtn()
	{
		this.posterBtnWrapElement.classList.remove('active')
		setTimeout(() =>
		{
			this.posterBtnWrapElement.style.display = 'none'
		}, 1000)
	}

	/**
	 * Poster Page
	 */
	setPosterScrollEvent()
	{
		window.addEventListener('scroll', (e) =>
		{
			this.posterScrollY = window.scrollY
		}, { passive: false })
	}
	showPosterPage()
	{
		this.timeDelta = Math.min(this.experience.time.delta, 0.03)
		this.posterContainer.style.setProperty('--movingTime', `${this.movingTime}s`)
		this.posterContainer.style.transform = 'translateY(0)'
		this.posterContainer.style.opacity = '1'
		//this.posterContainer.style.backgroundColor = '#dedfd980'
		this.utilityGroup.style.display = 'none'
		this.missionELement.style.display = 'none'
		this.hidePosterBtn()
		setTimeout(() =>
		{
			this.bodyElement.style.overflow = 'auto'
			this.isPosterPageActive = true
			this.posterContainer.style.setProperty('--movingTime', `0s`)
		}, this.movingTime * 1000)
	}
	setHidePosterPage()
	{
		const hideButtonTop = document.querySelector('#posterHomeBtn')
		hideButtonTop.addEventListener('click', () =>
		{
			this.hidePosterPage()
		})

		const hideButtonBottom = document.querySelector('#finalPhotoBtn')
		hideButtonBottom.addEventListener('click', () =>
		{
			this.hidePosterPage()
		})
	}

	hidePosterPage()
	{
		this.isPosterPageActive = false
		this.posterContainer.style.setProperty('--movingTime', `0.5s`)
		this.posterContainer.style.opacity = '0'
		this.scene.instance.visible = true
		this.utilityGroup.style.display = 'flex'
		this.missionELement.style.display = 'block'

		gsap.to(this.camera.instance.position, {
			duration: this.movingTime,
			x: 38,
			y: 13,
			z: 35,
		})
		gsap.to(this.camera.controls.target, {
			duration: this.movingTime,
			x: 0,
			y: 0,
			z: 0,
		})
		this.bodyElement.style.overflow = 'hidden'
		window.scrollTo({top: 0})
		this.posterScrollY = 0
		this.posterCurrentY = 0
		setTimeout(() =>
		{
			this.posterContainer.style.transform = `translateY(100vh)`
			this.camera.controls.enabled = true
			this.camera.setControlLimits()
		}, this.movingTime * 1000)
	}
	scrollAnimation()
	{
		this.posterCurrentY += (this.posterScrollY - this.posterCurrentY) * this.timeDelta * 4
		if(this.posterCurrentY < 1) this.posterCurrentY = 0
		this.posterContainer.style.transform = `translateY(${-this.posterCurrentY}px)`
	}
	resize()
	{
		this.posterContainerHeight = this.posterContainer.clientHeight
		this.bodyElement.style.height = `${this.posterContainerHeight}px`
	}
	update()
	{
		if(this.isPosterPageActive)
		{
			this.scrollAnimation()
		}
	}
}