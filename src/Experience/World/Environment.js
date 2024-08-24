import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Environment
{
	constructor()
	{
		this.experience = new Experience()
		this.scene = this.experience.scene

		this.setAmbientLight()
		this.setDirectionalLight()
	}
	setSceneBackground()
	{
		this.scene.background = new THREE.Color( '#292420' )
	}
	setAmbientLight()
	{
		this.ambientLight = new THREE.AmbientLight( '#ffffff', 5 )
		this.scene.add( this.ambientLight )
	}
	setDirectionalLight()
	{
		this.directionalLight = new THREE.DirectionalLight( '#ffffff', 0.8 )
		this.directionalLight.position.set( 1, 2, 3 )
		this.scene.add( this.directionalLight )
	}
}