import * as THREE from 'three'
import Experience from '../../../../Experience.js'

export default class Can
{
	constructor(_interactionObjects)
	{
		this.interactionObjects = _interactionObjects
		this.model = this.interactionObjects.can
		this.modelShadow = this.interactionObjects.canShadow

		this.experience = new Experience()
		this.resources = this.experience.resources

		this.setShadow()
	}

	setShadow()
	{
		this.shadowOpacityTexture = this.resources.items.canShadowOpacityTexture
		this.shadowOpacityTexture.flipY = false

		this.modelShadow.material = new THREE.MeshBasicMaterial({
			color: '#000000',
			transparent: true,
			alphaMap: this.shadowOpacityTexture
		})
	}
}