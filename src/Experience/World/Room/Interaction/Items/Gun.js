import * as THREE from 'three'
import Experience from '../../../../Experience.js'

export default class Gun
{
	constructor(_interactionObjects)
	{
		this.experience = new Experience()
		this.resources = this.experience.resources
		this.interactionObjects = _interactionObjects
		this.mesh = this.interactionObjects.gun

		this.setShadow()
	}

	setShadow()
	{
		this.shadowOpacityTexture = this.resources.items.gunShadowOpacityTexture
		this.shadowOpacityTexture.flipY = false

		this.shadowMesh = this.interactionObjects.gunShadow
		this.shadowMesh.material = new THREE.MeshBasicMaterial({
			color: '#000000',
			transparent: true,
			alphaMap: this.shadowOpacityTexture
		})
	}
}