import Experience from '@/Experience/Experience.js'
import Calendar from './Items/Calendar.js'
import Can from './Items/Can.js'
import Drawer from './Items/Drawer.js'
import Fireplace from './Items/Fireplace.js'
import Gun from './Items/Gun.js'
import LaptopScreen from './Items/LaptopScreen.js'
import Locker from './Items/Locker.js'
import Memo from './Items/Memo.js'
import Pointer from './Items/Pointer.js'
import Poster from './Items/Poster.js'
import TvScreen from './Items/TvScreen.js'
import Windbell from './Items/Windbell.js'
import Lights from './Items/Lights.js'
import PosterPage from './Items/PosterPage.js'

let instance = null

export default class Interaction
{
	constructor()
	{
		if(instance)
			return instance

		instance = this

		this.experience = new Experience()
		this.resources = this.experience.resources
		this.roomModel = this.resources.items.roomModel.scene
		this.pointerInstancedMesh = null
		this.resources.setInteractionItems( this.roomModel, 'InteractionGroup' )
		this.roomInteractionObjects = this.resources.interactionItems[ 'InteractionGroup' ]

		this.activateInteractions()
	}

	activateInteractions()
	{
		// Pointer
		this.pointer = new Pointer( this.roomInteractionObjects )

		// Calendar
		this.calendar = new Calendar( this.roomInteractionObjects )

		// Gun
		this.gun = new Gun( this.roomInteractionObjects )

		// Can
		this.can = new Can( this.roomInteractionObjects )

		// Drawer
		this.drawer = new Drawer( this.roomInteractionObjects )

		// Fireplace
		this.fireplace = new Fireplace( this.roomInteractionObjects )

		// LaptopScreen
		this.laptopScreen = new LaptopScreen( this.roomInteractionObjects )

		// Lights
		this.lights = new Lights( this.roomInteractionObjects )

		// Locker
		this.locker = new Locker( this.roomInteractionObjects )

		// Memo
		this.memo = new Memo( this.roomInteractionObjects )

		// Poster
		this.poster = new Poster( this.roomInteractionObjects )
		this.posterPage = new PosterPage()

		// TvScreen
		this.tvScreen = new TvScreen( this.roomInteractionObjects )

		// Windbell
		this.windbell = new Windbell( this.roomInteractionObjects )

	}
	resize()
	{
		this.memo.resize()
		this.poster.resize()
		this.posterPage.resize()
		this.locker.resize()
		this.can.resize()
	}
	update()
	{
		this.windbell.update()
		this.laptopScreen.update()
		this.locker.update()
		this.pointer.update()
		this.poster.update()
		this.memo.update()
		this.can.update()
		this.fireplace.update()
	}
}