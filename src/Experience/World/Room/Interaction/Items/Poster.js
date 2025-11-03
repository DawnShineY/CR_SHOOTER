import * as THREE from 'three'
import Experience from '../../../../Experience.js'
import Interaction from '../Interaction.js'

export default class Poster
{
	constructor()
	{
		this.interaction = new Interaction()
		this.pointer = this.interaction.pointer
		this.setPointerEvent()

	}
	setPointerEvent()
	{
		this.pointer.on('click', (obj) =>
		{
			if(obj === 'poster')
			{
				console.log('this is poster')
			}
		})
	}
}