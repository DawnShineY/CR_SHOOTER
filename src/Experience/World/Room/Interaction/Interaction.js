import Experience from '../../../Experience.js'
import Calendar from './Items/Calendar.js'
import Can from './Items/Can.js'
import Drawer from './Items/Drawer.js'
import Fireplace from './Items/Fireplace.js'
import Gun from './Items/Gun.js'
import LaptopScreen from './Items/LaptopScreen.js'
import LightMode from './Items/LightMode.js'
import Locker from './Items/Locker.js'
import Memo from './Items/Memo.js'
import Pointer from './Items/Pointer.js'
import Poster from './Items/Poster.js'
import TvScreen from './Items/TvScreen.js'
import Windbell from './Items/Windbell.js'

import setInteractionGroup from '../../../Helpers/setInteractionGroup.js'

export default class Interaction
{
	constructor()
	{
		this.experience = new Experience()
		this.resources = this.experience.resources
		this.roomModel = this.resources.items.roomModel.scene
		this.pointerInstancedMesh = null
		this.roomInteractionObjects = setInteractionGroup(this.roomModel, 'InteractionGroup')

		this.activateInteractions()
	}

	activateInteractions()
	{
		// Calendar
		this.calendar = new Calendar( this.roomInteractionObjects )

		// Can
		this.can = new Can( this.roomInteractionObjects )

		// Drawer
		this.drawer = new Drawer( this.roomInteractionObjects )

		// Fireplace
		this.fireplace = new Fireplace( this.roomInteractionObjects )

		// Gun
		this.gun = new Gun( this.roomInteractionObjects )

		// LaptopScreen
		this.laptopScreen = new LaptopScreen( this.roomInteractionObjects )

		// LightMode
		this.lightMode = new LightMode( this.roomInteractionObjects )

		// Locker
		this.locker = new Locker( this.roomInteractionObjects )

		// Memo
		this.memo = new Memo( this.roomInteractionObjects )

		// Pointer
		this.pointer = new Pointer( this.roomInteractionObjects )

		// Poster
		this.poster = new Poster( this.roomInteractionObjects )

		// TvScreen
		this.tvScreen = new TvScreen( this.roomInteractionObjects )

		// Windbell
		this.windbell = new Windbell( this.roomInteractionObjects )

	}

	//setInteractionGroup()
	//{
	//	const interactionGroup = this.roomModel.children.find(( child ) =>
	//	{
	//		return child.name === 'InteractionGroup'
	//	})
	//	this.makeInteractionGroup( this.roomInteractionObjects, interactionGroup.children )
	//	console.log( this.roomInteractionObjects )
	//}


	//makeInteractionGroup( object, children )
	//{
	//	for(let child of children)
	//	{
	//		if(child.children.length && child.type === 'Object3D') // 자식이 있는 빈 객체
	//		{
	//			object[ child.name ] = {}
	//			this.makeInteractionGroup( object[ child.name ], child.children )
	//		}
	//		else if( child.inInstancedMesh ) // instanced mesh
	//		{
	//			object[ child.name ] = child
	//		}
	//		else if(child.isMesh || child.type === 'Object3D') // mesh 이거나 자식이 없는 빈 객체
	//		{
	//			if(child.children.length)
	//				this.makeInteractionGroup( object, child.children )

	//			object[child.name] = child
	//		}
	//	}
	//}
	update()
	{
		this.windbell.update()
		this.laptopScreen.update()
	}
}