import * as THREE from 'three'
import Experience from '../../../../Experience.js'
import pointerIndex from '../../../../Data/pointerIndex.js'

export default class Pointer
{
	constructor(_interactionObjects)
	{
		this.interactionObjects = _interactionObjects
		this.instancedMesh = this.interactionObjects.pointerGroup

		this.experience = new Experience()
		this.camera = this.experience.camera
		this.raycaster = this.experience.raycaster
		this.canvas = this.experience.canvas

		this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
		console.log('isMobile:', this.isMobile)


		this.prevInstancedId = null
		this.prevMouseIn = false
		this.clickEvent = null
		this.defaultColor = new THREE.Color( '#7e1e00' )
		this.activeColor = new THREE.Color( '#ec4a38' )
		this.matrix = new THREE.Matrix4()
		this.scaleAmount = 1.5
		this.scaleMatrix = new THREE.Matrix4().makeScale( this.scaleAmount, this.scaleAmount, this.scaleAmount )
		this.scaleDownMatrix = new THREE.Matrix4().makeScale( 1 / this.scaleAmount, 1 / this.scaleAmount, 1 / this.scaleAmount )

		this.setDefaultColor()
		this.updateRaycaster()
	}

	setDefaultColor()
	{
		for(let i = 0; i < this.instancedMesh.count; i++)
			this.instancedMesh.setColorAt( i, this.defaultColor )

		this.instancedMesh.instanceColor.needsUpdate = true
	}

	updateRaycaster()
	{
		const intersection = this.raycaster.instance.intersectObject( this.instancedMesh )

		if(intersection.length > 0)
		{
			const instancedId = intersection[ 0 ].instanceId

			if (instancedId == this.prevInstancedId) return

			if( this.prevInstancedId !== null ) { // pointer에서 pointer로 바로 옮겨왔을 때도 이전 pointer reset 필요
				this.resetPointer()
			}

			this.setPointer(instancedId)
			document.body.style.cursor = 'pointer'
		}
		else
		{
			if( this.prevInstancedId == null ) return

			this.resetPointer()
			document.body.style.cursor = 'default'
		}
	}

	setPointer = (instancedId) => {
		// Color
		this.instancedMesh.setColorAt( instancedId, this.activeColor )
		this.instancedMesh.instanceColor.needsUpdate = true

		if(!this.prevMouseIn)
		{
			// Matrix
			this.instancedMesh.getMatrixAt( instancedId, this.matrix )
			this.matrix.multiply( this.scaleMatrix )
			this.instancedMesh.setMatrixAt( instancedId, this.matrix )
			this.instancedMesh.instanceMatrix.needsUpdate = true

			// Click event
			this.clickEvent = this.focusCamera( instancedId )
			if(this.isMobile)
			{
				this.clickEvent()
			}
			else
			{
				this.canvas.addEventListener( 'click', this.clickEvent, { passive: false } )
			}
		}

		this.prevMouseIn = true
		this.prevInstancedId = instancedId
	}

	resetPointer = () => {
		this.instancedMesh.setColorAt( this.prevInstancedId, this.defaultColor )
		this.instancedMesh.instanceColor.needsUpdate = true

		if(this.prevMouseIn)
		{
			// Matrix
			this.instancedMesh.getMatrixAt( this.prevInstancedId, this.matrix )
			this.matrix.multiply( this.scaleDownMatrix )
			this.instancedMesh.setMatrixAt( this.prevInstancedId, this.matrix )
			this.instancedMesh.instanceMatrix.needsUpdate = true

			// Remove click event
			if (!this.isMobile)
			this.canvas.removeEventListener( 'click', this.clickEvent, { passive: false } )
		}

		this.prevMouseIn = false
		this.prevInstancedId = null
	}

	focusCamera = ( index ) =>
	{
		return (event) =>
		{
			if(event){
				event.preventDefault()
			}
			this.camera.instance.position.set( ...pointerIndex[ index ].cameraPosition )
			this.camera.controls.target.set( ...pointerIndex[ index ].controlTarget )
		}
	}

	update()
	{
		this.updateRaycaster()
	}
}