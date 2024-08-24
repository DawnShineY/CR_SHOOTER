import * as THREE from 'three'
import Experience from '../../../../Experience.js'

export default class Can
{
	constructor(_interactionObjects)
	{
		this.experience = new Experience()
		this.resources = this.experience.resources
		this.interactionObjects = _interactionObjects
		this.mesh = this.interactionObjects.can

		this.setShadow()
	}

	setShadow()
	{
		this.shadowOpacityTexture = this.resources.items.canShadowOpacityTexture
		this.shadowOpacityTexture.flipY = false

		this.shadowMesh = this.interactionObjects.canShadow
		this.shadowMesh.material = new THREE.MeshBasicMaterial({
			color: '#000000',
			transparent: true,
			alphaMap: this.shadowOpacityTexture
		})
	}
}