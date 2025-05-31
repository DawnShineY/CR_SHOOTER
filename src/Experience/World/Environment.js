import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Environment
{
	constructor()
	{
		this.experience = new Experience()
		this.scene = this.experience.scene

		this.setLightMode()
	}
	setLightMode()
	{
		this.scene.background = new THREE.Color( '#292420' )
		this.ambientLight = new THREE.AmbientLight( '#ffffff', 4 )
		this.scene.add( this.ambientLight )
		this.directionalLight = new THREE.DirectionalLight( '#ffffff', 0. )
		this.directionalLight.position.set( 1, 2, 3 )
		this.scene.add( this.directionalLight )
	}
	setDarkMode()
	{
		this.scene.background = new THREE.Color( '#1C1D19' )

	}
	changeMode(mode)
	{
		if(mode === 'light')
		{
			console.log('light mode')
			this.setLightMode()
		}
		else if(mode === 'dark')
		{
			console.log('dark mode')
		}
	}
}