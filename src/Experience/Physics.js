import CANNON from 'cannon'
import Experience from '@/Experience/Experience.js'


export default class Physics
{
	constructor()
	{
		this.experience = new Experience()
		this.time = this.experience.time

		this.world = new CANNON.World()
		this.world.gravity.set( 0, -9.82, 0 )
		this.world.broadphase = new CANNON.SAPBroadphase( this.world )
		this.world.allowSleep = true
	}
	update()
	{
		this.world.step( 1 / 60, this.time.delta, 3 )
	}
}
