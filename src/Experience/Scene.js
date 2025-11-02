import * as THREE from 'three'

export default class Scene
{
	constructor()
	{
		this.instance = new THREE.Scene()
		this.setModelGroup()
		console.log(this.modelGroup)
	}
	setModelGroup()
	{
		this.modelGroup = new THREE.Group()
		this.instance.add(this.modelGroup)
	}
}