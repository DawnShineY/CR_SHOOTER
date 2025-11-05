import * as THREE from 'three'
import Experience from '../../../../Experience.js'
import Interaction from '../Interaction.js'

export default class Poster
{
	constructor()
	{
		this.interaction = new Interaction()
		this.pointer = this.interaction.pointer
		this.posterBtnElement = document.querySelector('#posterBtnWrap')
		this.posterClsBtnElement = document.querySelector('#posterClsBtn')

		this.setCloseBtnClickEvent()
		this.setPointerEvent()
		this.resetPointerEvent()
		


	}
	setPointerEvent()
	{
		this.pointer.on('click', (obj) =>
		{
			if(obj === 'poster')
			{
				this.posterBtnElement.style.display = 'block'
				setTimeout(() =>
				{
					this.posterBtnElement.classList.add('active')
				}, 0)
			}
		})
	}
	resetPointerEvent()
	{
		this.pointer.on('reset', () =>
		{
			this.closePosterBtn()
		})
	}
	setCloseBtnClickEvent()
	{
		this.posterClsBtnElement.addEventListener('click', () =>{
			this.closePosterBtn()
		})
	}
	closePosterBtn()
	{
		this.posterBtnElement.classList.remove('active')
		setTimeout(() =>
		{
			this.posterBtnElement.style.display = 'none'
		}, 1000)
	}
}