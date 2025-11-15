import * as THREE from 'three'
import Experience from '../../../../Experience.js'
import Interaction from '../Interaction.js'
import gsap from 'gsap'

export default class Fireplace
{
	constructor(_interactionObjects)
	{
		this.interactionObjects = _interactionObjects
		this.group = this.interactionObjects.lightsPositionGroup
		this.fireplacePosition = this.group.fireplacePosition.position

		this.experience = new Experience()
		this.modelGroup = this.experience.scene.modelGroup
		this.debug = this.experience.debug
		this.resources = this.experience.resources
		this.time = this.experience.time

		this.setFire()
		this.setSmoke()

		this.interaction = new Interaction()
		this.pointer = this.interaction.pointer
		this.setPointerEvent()
		this.resetPointerEvent()

		if(this.debug.active)
		{
			this.debug.ui.add(this.smokeMesh.position, 'x').min(-5).max(-5)
		}
	}

	setPointerEvent()
	{
		this.pointer.on('click', (obj) =>
		{
			if(obj === 'fireplace')
			{
				this.fireplaceLight.visible = true
				this.smokeMesh.visible = true
				gsap.to(
					this.smokeMaterial.uniforms.uOpacity,
					{
						value: 1,
						duration: 1
					}
				)
				gsap.to(
				this.fireplaceLight,
				{
					intensity: 10,
					duration: 1,
				}
			)
			}
		})
	}
	resetPointerEvent()
	{
		this.pointer.on('reset', () =>
		{
			gsap.to(
				this.smokeMaterial.uniforms.uOpacity,
				{
					value: 0,
					duration: 1,
					onComplete: () =>
					{
						this.smokeMesh.visible = false
					}
				}
			)
			gsap.to(
				this.fireplaceLight,
				{
					intensity: 0,
					duration: 1,
					onComplete: () =>
					{
						this.fireplaceLight.visible = false
					}
				}
			)
		})
	}

	setFire()
	{
		this.fireplaceLight = new THREE.PointLight('#c21e1e', 0, 1, 1)
		this.fireplaceLight.position.copy(this.fireplacePosition)
		this.fireplaceLight.visible = false
		this.modelGroup.add( this.fireplaceLight )
	}

	setSmoke()
	{
		this.perlinTexture = this.resources.items.perlinTexture
		this.perlinTexture.wrapS = THREE.RepeatWrapping
		this.perlinTexture.wrapT = THREE.RepeatWrapping

		const smokeGeometry = new THREE.PlaneGeometry(0.7, 2.1, 16, 48)
		smokeGeometry.translate(0, 1.05, 0)
		this.smokeMaterial = new THREE.ShaderMaterial({
			transparent: true,
			depthWrite: false,
			side: THREE.DoubleSide,
			uniforms: {
				uTime: new THREE.Uniform(0),
				uPerlinTexture: new THREE.Uniform(this.perlinTexture),
				uOpacity: new THREE.Uniform(0)
			},
			vertexShader: `
				varying vec2 vUv;
				uniform sampler2D uPerlinTexture;
				uniform float uTime;

				vec2 rotate2D(vec2 value, float angle)
				{
					float s = sin(angle);
					float c = cos(angle);
					mat2 m = mat2(c, s, -s, c);
					return m * value;
				}

				void main()
				{
					vec3 newPosition = position;

					// Twist
					float twistPerlin = texture(
					uPerlinTexture,
					vec2(0.5, uv.y * 0.2 - uTime * 0.01)
					).r;
					float angle = twistPerlin * 10.0;
					newPosition.xz = rotate2D(newPosition.xz, angle);

					// Wind
					vec2 windOffset = vec2(
						texture(uPerlinTexture, vec2(0.25, uTime * 0.01)).r - 0.5,
						texture(uPerlinTexture, vec2(0.75, uTime * 0.01)).r - 0.5
					);
					windOffset *= pow(uv.y, 2.0) * 5.0;
					newPosition.xz += windOffset;

					vUv = uv;

					gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
				}
			`,
			fragmentShader: `
				uniform float uTime;
				uniform float uOpacity;
				uniform sampler2D uPerlinTexture;
				varying vec2 vUv;

				void main()
				{
					vec2 smokeUv = vUv;
					smokeUv.x *= 0.5;
					smokeUv.y *= 0.3;
					smokeUv.y -= uTime * 0.1;

					float smoke = texture(uPerlinTexture, smokeUv).r;
					smoke = smoothstep(0.4, 1.0, smoke);

					smoke *= smoothstep(0.0, 0.1, vUv.x);
					smoke *= smoothstep(1.0, 0.9, vUv.x);
					smoke *= smoothstep(0.0, 0.1, vUv.y);
					smoke *= smoothstep(1.0, 0.4, vUv.y);

					smoke -= (1.0 - uOpacity);

					gl_FragColor = vec4(1.0, 1.0, 1.0, smoke);

					#include <colorspace_fragment>
				}
			`
		})

		this.smokeMesh = new THREE.Mesh( smokeGeometry, this.smokeMaterial )
		this.smokeMesh.position.set(-0.175086, 7.70239, -4.29974)
		this.modelGroup.add(this.smokeMesh)
		this.smokeMesh.visible = false
	}

	update()
	{
		this.smokeMaterial.uniforms.uTime.value = this.time.elapsed
	}

}