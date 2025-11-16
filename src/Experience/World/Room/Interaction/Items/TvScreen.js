import { VideoTexture, MeshPhongMaterial, SRGBColorSpace, LinearMipMapLinearFilter } from 'three'
import Experience from '@/Experience/Experience.js'
import Interaction from '../Interaction.js'
import gsap from 'gsap'

export default class TvScreen
{
	constructor( _interactionObjects )
	{
		this.experience = new Experience()
		this.interactionObjects = _interactionObjects
		this.model = this.interactionObjects.tvScreen

		this.setVideoElement()
		this.setVideoTexture()

		this.interaction = new Interaction()
		this.pointer = this.interaction.pointer
		this.setPointerEvent()
		this.resetPointerEvent()
	}

	setPointerEvent()
	{
		this.pointer.on( 'click', ( obj ) =>
		{
			if(obj === 'tv')
			{
				this.model.material.color.set( '#E1E1E1' )
				this.model.material.map = this.videoTexture
				this.model.material.needsUpdate = true
				this.videoElement.play()

				gsap.to(
					this.videoElement,
					{
						volume: 0.1,
						duration: 1
					}
				)
			}
		})
	}

	resetPointerEvent()
	{
		this.pointer.on('reset', () =>
		{
			this.model.material.color.set( '#202020' )
			this.model.material.map = null
			this.model.material.needsUpdate = true
			this.videoElement.pause()
			this.videoElement.currentTime = 0
		})
	}

	setVideoElement()
	{
		this.videoElement = document.getElementById( 'video' )
	}

	setVideoTexture()
	{
		this.videoTexture = new VideoTexture( this.videoElement )
		this.videoTexture.colorSpace = SRGBColorSpace
		this.videoTexture.flipY = false
		this.videoTexture.repeat.set(1.1, 1.4)
		this.videoTexture.offset.x = - 0.05
		this.videoTexture.offset.y = - 0.2
		this.videoTexture.generateMipmaps = true
		this.videoTexture.minFilter = LinearMipMapLinearFilter

		this.model.material = new MeshPhongMaterial(
			{
				color: '#202020',
				shininess: 100,
				specular: '#505050',
				emissive: '#171717'
			}
		)
	}
}