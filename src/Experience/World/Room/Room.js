import * as THREE from 'three'
import Experience from '../../Experience.js'
import Interaction from './Interaction/Interaction.js'

export default class Room
{
	constructor()
	{
		this.experience = new Experience()
		this.scene = this.experience.scene
		this.resources = this.experience.resources
		this.model = this.resources.items.roomModel.scene

		this.interaction = new Interaction()

		this.setModel()
	}
	setModel()
	{
		this.modelGroup = new THREE.Group()
		this.scene.add(this.modelGroup)

		const boundingBox = new THREE.Box3().setFromObject( this.model )
		const boundingBoxSize = new THREE.Vector3()
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