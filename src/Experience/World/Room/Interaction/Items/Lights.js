import * as THREE from 'three'
import Experience from "../../../../Experience"
import gsap from 'gsap'

export default class Lights {
	constructor(_interactionObjects)
	{
		this.interactionObjects = _interactionObjects
		this.group = this.interactionObjects.lightsPositionGroup
		this.experience = new Experience()
		this.debug = this.experience.debug
		this.resources = this.experience.resources
		this.modelGroup = this.experience.scene.modelGroup

		this.candle1Position = this.group.candle1Position.position
		this.candle2Position = this.group.candle2Position.position
		this.fireplacePosition = this.group.fireplacePosition.position
		this.lamp1Position = this.group.lamp1Position.position
		this.lamp2Position = this.group.lamp2Position.position
		this.lightPosition = this.group.lightPosition.position
		this.standPosition = this.group.standPosition.position

		this.switchElement = document.querySelector('#lightToggleBtn')
		const isLightMode = this.switchElement.classList.contains('active')

		this.setLights()
		this.setToggleSwitch()
		this.turnLightsOn( !isLightMode )
	}
	setLights()
	{
		this.mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({color: 'red'}))

		this.candleLight1 = new THREE.PointLight('#ff7a5c', 3, 0.5, 0)
		this.candleLight1.position.copy(this.candle1Position)
		this.pointLightHelper1 = new THREE.PointLightHelper(this.candleLight1)
		this.pointLightHelper1.update()

		this.candleLight2 = new THREE.PointLight('#ff7a5c', 3, 0.5, 0)
		this.candleLight2.position.copy(this.candle2Position)

		this.standLight = new THREE.SpotLight('#ffceb0', 70, 1.5, Math.PI * 0.25, 1, 0.01)
		this.standLight.position.copy(this.standPosition)
		this.standLight.target.position.copy(this.standPosition)
		this.standLight.target.position.y -= 3
		this.standLight.target.position.z += 0.3
		//const spotLightHelper = new THREE.SpotLightHelper(this.standLight)
		//spotLightHelper.update()

		this.standLight2 = new THREE.SpotLight('#ffceb0', 100, 5, Math.PI * 0.25, 1, 1)
		this.standLight2.position.copy(this.lightPosition)
		this.standLight2.target.position.copy(this.lightPosition)
		this.standLight2.target.position.x -= 1
		this.standLight2.target.position.y -= 5
		this.standLight2.target.position.z += 3

		//this.fireplaceLight = new THREE.PointLight('#de00a7', 10, 1, 1)
		//this.fireplaceLight.position.copy(this.fireplacePosition)

		this.lampLight1 = new THREE.PointLight('#ffceb0', 5, 2, 1)
		this.lampLight1.position.copy(this.lamp1Position)

		this.lampLight2 = new THREE.PointLight('#ffceb0', 10, 2, 1)
		this.lampLight2.position.copy(this.lamp2Position)

		this.lightsArray = [
			this.candleLight1, this.candleLight2,
			this.standLight, this.standLight.target,
			this.standLight2, this.standLight2.target,
			this.lampLight1, this.lampLight2
		]

		this.modelGroup.add(
			this.candleLight1,
			this.candleLight2,
			this.standLight, this.standLight.target,
			this.standLight2, this.standLight2.target,
			this.lampLight1, this.lampLight2
		)
	}
	setToggleSwitch() {
		this.switchElement.addEventListener('click', (e) =>
		{
			const isActive = this.switchElement.classList.contains('active')
			if(isActive)
			{
				this.switchElement.classList.remove('active')
				this.turnLightsOn(isActive)
			}
			else
			{
				this.switchElement.classList.add('active')
				this.turnLightsOn(isActive)
			}
		})
	}

	setLightIntensity(object, intensity)
	{
		gsap.to(object, {
			intensity,
			duration: 1,
			ease: 'power1.inOut'
		})
	}

	turnLightsOn(value)
	{
		if(value)
		{
			for(let object of this.lightsArray)
			{
				object.visible = true
			}
			setTimeout(() =>
			{
				this.setLightIntensity(this.candleLight1, 3)
				this.setLightIntensity(this.candleLight2, 3)
				this.setLightIntensity(this.standLight, 70)
				this.setLightIntensity(this.standLight2, 100)
				this.setLightIntensity(this.lampLight1, 5)
				this.setLightIntensity(this.lampLight2, 10)
			}, 500)
		}
		else
		{
			for(let object of this.lightsArray)
			{
				this.setLightIntensity(object, 0)
				setTimeout(() => {
					object.visible = false
				}, 1000)
			}
		}
	}
}