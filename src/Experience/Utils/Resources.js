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

		this.setLoadingManager()
		this.setLoaders()
		this.startLoading()
	}

	setLoadingManager()
	{
		this.loadingManager = new THREE.LoadingManager()
		this.loadingManager.onLoad = () =>
		{
			this.trigger( 'ready' )
		}
		this.loadingManager.onProgress = ( url, itemLoaded, itemsTotal ) =>
		{
			this.trigger( 'progress', [ url, itemLoaded, itemsTotal ] )
		}
	}

	setLoaders()
	{

		this.loaders = {}
		this.loaders.textureLoader = new THREE.TextureLoader( this.loadingManager )

		const dracoLoader = new DRACOLoader()
		dracoLoader.setDecoderPath( '/draco/' )

		this.loaders.gltfLoader = new GLTFLoader( this.loadingManager )
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
	}
}