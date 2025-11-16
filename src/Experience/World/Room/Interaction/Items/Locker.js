import { BufferGeometry, BufferAttribute, Points, ShaderMaterial, AdditiveBlending } from 'three'
import Experience from '@/Experience//Experience.js'
import Interaction from '../Interaction.js'
import gsap from 'gsap'

export default class Locker
{
	constructor( _interactionObjects )
	{
		this.interactionObjects = _interactionObjects
		this.model = this.interactionObjects.lockerDoor

		this.experience = new Experience()
		this.pixelRatio = this.experience.sizes.pixelRatio
		this.time = this.experience.time
		this.debug = this.experience.debug
		this.modelGroup = this.experience.scene.modelGroup
		this.isOpen = false

		this.interaction = new Interaction()
		this.pointer = this.interaction.pointer
		this.setPointerEvent()
		this.resetPointerEvent()

		this.setFireflies()

		if(this.debug.active) {
			this.debugFolder = this.debug.ui.addFolder('락커문')
			this.debugFolder.add(this.model.rotation, 'y').min(-Math.PI * 0.4).max(0).step(0.01)
			this.debugFolder.add(this.fireflies.position, 'z').min(-5).max(5).step(0.01)
			this.debugFolder.add(this.fireflies.position, 'y').min(-5).max(5).step(0.01)
		}
	}

	setPointerEvent()
	{
		this.pointer.on('click', ( obj ) =>
		{
			if(obj === 'lockerDoor')
			{
				this.isOpen = true
				this.fireflies.visible = true
				gsap.to(
					this.model.rotation,
					{
						y: -Math.PI * 0.4,
						duration: 1,
						delay: 0.8,
						ease: 'power2.inOUt',
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
				this.model.rotation,
				{
					y: 0,
					duration: 1,
					delay: 0,
					ease: 'power2.inOUt',
					onComplete: () =>
					{
						this.isOpen = false
						this.fireflies.visible = false
					}
				}
			)
		})
	}

	setFireflies()
	{
		this.geometry = new BufferGeometry()
		const count = 80
		const positionArray = new Float32Array( count * 3 )
		const colorArray = new Float32Array( count * 3 )
		const scaleArray = new Float32Array( count )

		/**
		 * Locker
		 * 왼쪽 문 중심 좌표 ( -3.68, 2.2, -3.165 )
		 * 왼쪽 문 길이 ( 1.06, 3.54, 0.85 )
		 *
		 */

		for(let i = 0; i < count; i++)
		{
			positionArray[ i * 3 + 0 ] = ( Math.random() - 0.5 ) * 0.8
			positionArray[ i * 3 + 1 ] = ( Math.random() - 0.5 ) * 2
			positionArray[ i * 3 + 2 ] = ( Math.random() - 0.5 ) * 0.6

			colorArray[ i * 3 + 0 ] = Math.random()
			colorArray[ i * 3 + 1 ] = Math.random()
			colorArray[ i * 3 + 2 ] = Math.random()

			scaleArray[ i ] = Math.random()
		}

		this.geometry.setAttribute( 'position', new BufferAttribute( positionArray, 3 ) )
		this.geometry.setAttribute( 'aColor', new BufferAttribute( colorArray, 3 ) )
		this.geometry.setAttribute( 'aScale', new BufferAttribute( scaleArray, 1 ) )

		this.material = new ShaderMaterial({
			blending: AdditiveBlending,
			depthWrite: false,
			transparent: true,
			uniforms: {
				uPixelRatio: { value: this.pixelRatio },
				uSize: { value: 1000 },
				uTime: { value: 0 },
			},
			vertexShader: this.setVertexShaderProgram(),
			fragmentShader: this.setFragmentShaderProgram()
		})

		this.fireflies = new Points( this.geometry, this.material )
		this.fireflies.position.set( -3.68, 2.5, -3.165 )
		this.fireflies.visible = false
		this.modelGroup.add( this.fireflies )
	}

	setVertexShaderProgram()
	{
		return (
			`
				uniform float uPixelRatio;
				uniform float uSize;
				uniform float uTime;
				attribute vec3 aColor;
				attribute float aScale;
				varying vec3 vColor;
				void main()
				{
					vec4 modelPosition = modelMatrix * vec4(position, 1.0);
					modelPosition.y += sin(uTime * modelPosition.x * 0.2) * 0.15;
					modelPosition.z += sin(uTime * modelPosition.y * 0.1) * 0.1;
					vec4 viewPosition = viewMatrix * modelPosition;
					vec4 projectionPosition = projectionMatrix * viewPosition;

					vColor = aColor;
					gl_PointSize = uSize * aScale * uPixelRatio;
					gl_PointSize *= (1.0 / - viewPosition.z);
					gl_Position = projectionPosition;
				}
			`
		)
	}
	setFragmentShaderProgram()
	{
		return (
			`
				varying vec3 vColor;
				void main()
				{
					float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
					float strength = 0.05 / distanceToCenter - 0.1;
					gl_FragColor = vec4(vColor, strength);
				}
			`
		)
	}
	resize()
	{
		this.material.uniforms.uPixelRatio.value = this.pixelRatio
	}
	update()
	{
		if(this.isOpen) this.material.uniforms.uTime.value = this.time.elapsed
	}
}