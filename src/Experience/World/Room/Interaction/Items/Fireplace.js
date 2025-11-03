import * as THREE from 'three'
import Experience from '../../../../Experience.js'
import Interaction from '../Interaction.js'

export default class Fireplace
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
			if(obj === 'fireplace')
			{
				console.log('this is fireplace')

				return
			}
		})
	}
}