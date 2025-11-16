import { Box3, Vector3 } from 'three'
import Experience from '@/Experience/Experience.js'
import Interaction from './Interaction/Interaction.js'

export default class Room
{
	constructor()
	{
		this.experience = new Experience()
		this.modelGroup = this.experience.scene.modelGroup
		this.resources = this.experience.resources
		this.model = this.resources.items.roomModel.scene

		this.interaction = new Interaction()

		this.setModel()
	}
	setModel()
	{
		const boundingBox = new Box3().setFromObject( this.model )
		const boundingBoxSize = new Vector3()
		boundingBox.getSize( boundingBoxSize )
		this.modelGroup.position.y -= boundingBoxSize.y * 0.4
		this.modelGroup.add( this.model)
	}
	resize()
	{
		this.interaction.resize()
	}
	update()
	{
		this.interaction.update()
	}
}