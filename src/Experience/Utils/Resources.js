import * as THREE from 'three'
import { DRACOLoader, GLTFLoader } from 'three/examples/jsm/Addons.js'
import sources from '../Data/sources.js'
import EventEmitter from './EventEmitter.js'

export default class Resources extends EventEmitter
{
	constructor()
	{
		super()

		this.sources = sources

		this.items = {}
		this.toLoad = this.sources.length
		this.loaded = 0

		this.setLoaders()
		this.startLoading()
	}

	setLoaders()
	{
		this.loaders = {}
		this.loaders.textureLoader = new THREE.TextureLoader()

		const dracoLoader = new DRACOLoader()
		dracoLoader.setDecoderPath( '/draco/' )
		console.log( dracoLoader )

		this.loaders.gltfLoader = new GLTFLoader()
		this.loaders.gltfLoader.setDRACOLoader( dracoLoader )
	}
	startLoading()
	{
		// Load each source
		for(const source of this.sources)
		{
			if(source.type === 'gltfModel')
			{
				this.loaders.gltfLoader.load(
					source.path,
					( file ) =>
					{
						this.sourceLoaded( source, file )
					}
				)
			}
			else if(source.type === 'texture')
			{
				this.loaders.textureLoader.load(
					source.path,
					( file ) =>
					{
						this.sourceLoaded( source, file )
					}
				)
			}
		}
	}
	sourceLoaded( source, file )
	{
		this.items[source.name] = file

		this.loaded ++

		if(this.loaded === this.toLoad)
		{
			console.log(this.items)
			this.trigger( 'ready' )
		}
	}
}