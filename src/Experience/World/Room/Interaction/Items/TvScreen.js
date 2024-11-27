import * as THREE from 'three'
import Experience from '../../../../Experience.js'

export default class TvScreen
{
	constructor(_interactionObjects)
	{
		this.experience = new Experience()
		this.interactionObjects = _interactionObjects
		this.model = this.interactionObjects.tvScreen

		this.setVideoElement()
		this.setVideoTexture()
	}

	setVideoElement()
	{
		this.videoElement = document.getElementById('video')
		this.videoElement.volume = 0.0
		this.videoElement.play()
	}

	setVideoTexture()
	{
		this.videoTexture = new THREE.VideoTexture( this.videoElement )
		this.videoTexture.colorSpace = THREE.SRGBColorSpace
		this.videoTexture.flipY = false
		this.videoTexture.repeat.set(1.1, 1.4)
		this.videoTexture.offset.x = - 0.05
		this.videoTexture.offset.y = - 0.2
		this.videoTexture.generateMipmaps = true
		this.videoTexture.minFilter = THREE.LinearMipMapLinearFilter

		this.model.material = new THREE.MeshPhongMaterial(
			{
				color: '#E1E1E1',
				map: this.videoTexture,
				shininess: 100,
				specular: '#505050',
				emissive: '#171717'
			}
		)
	}
}