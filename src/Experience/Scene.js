import * as THREE from 'three'

export default class Scene
{
	constructor()
	{
		this.instance = new THREE.Scene()
		this.instance.background = new THREE.Color( '#292420' )
	}

}