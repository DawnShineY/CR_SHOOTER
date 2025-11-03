import * as THREE from 'three'
import Experience from '../Experience.js'
import gsap from 'gsap'

export default class Environment
{
	constructor()
	{
		this.experience = new Experience()
		this.scene = this.experience.scene.instance
		this.debug = this.experience.debug
		this.switchElement = document.querySelector('#lightToggleBtn')
		const isLightMode = this.switchElement.classList.contains('active')

		this.modeObject = {
			bgCurrentColor: '#958a75',
			bgDayColor: '#958a75',
			bgNightColor: '#292a27'
		}

		this.setDefaultLight()
		this.changeLightMode(isLightMode)
		this.setToggleSwitch()

		if(this.debug.active) {
			this.setDebug()
		}
	}

	setDefaultLight()
	{
		/**
		 * Environment Lights
		 */
		this.scene.background = new THREE.Color(this.modeObject.bgDayColor)
		this.ambientLight = new THREE.AmbientLight( '#ffffff', 0 )
		this.scene.add( this.ambientLight )
		this.directionalLight = new THREE.DirectionalLight( '#ffffff', 0 )
		this.directionalLight.position.set( 1, 2, 3 )
		this.scene.add( this.directionalLight )
	}

	changeLightMode(isLightMode)
	{
		if(isLightMode)
		{
			this.setLightMode()
		}
		else
		{
			this.setDarkMode()
		}

	}

	setToggleSwitch()
	{
		this.switchElement.addEventListener('click', (e) =>
		{
			const isActive = this.switchElement.classList.contains('active')
			this.changeLightMode( !isActive )
		})
	}

	setLightMode()
	{
		this.changeSceneBgColor(this.modeObject.bgDayColor)
		this.changeLightIntensity(this.ambientLight, 2)
		this.changeLightIntensity(this.directionalLight, 4.5)
	}

	setDarkMode()
	{
		this.changeSceneBgColor(this.modeObject.bgNightColor)
		this.changeLightIntensity(this.ambientLight, 1)
		this.changeLightIntensity(this.directionalLight, 1.5)
	}

	changeSceneBgColor(color)
	{
		gsap.to(this.modeObject, {
			bgCurrentColor: color,
			duration: 1,
			ease: 'power2.inOut',
			onUpdate: () => {
				this.scene.background.set(this.modeObject.bgCurrentColor)
			}
		})
	}
	changeLightIntensity(obj, intensity)
	{
		gsap.to(obj, {
			intensity,
			duration: 1,
			ease: 'power2.inOut'
		})
	}

	setDebug()
	{
		this.debugFolder = this.debug.ui.addFolder('Environment Light')

		/** Day/Night Mode */
		this.debugObject =
		{
			bgColor: this.modeObject.bgDayColor,
			lightMode: 'day',
		}

		/**
		 * Separate Light Control
		 */
		this.debugFolder.addColor(
			this.debugObject,
			'bgColor'
		).onChange(value =>
		{
			this.scene.background = new THREE.Color(value)
		})

		/**
		 * Add Light Parameters
		 */
		this.debugFolder.addColor(this.ambientLight, 'color').name('Ambient Light Color')
		this.debugFolder.add(this.ambientLight, 'intensity').name('Ambient intensity').min(0).max(10).step(0.01)
		this.debugFolder.addColor(this.directionalLight, 'color').name('directional Light Color')
		this.debugFolder.add(this.directionalLight, 'intensity').name('directional intensity').min(0).max(10).step(0.01)
	}
}