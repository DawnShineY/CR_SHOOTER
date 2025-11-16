import { Scene, Group } from 'three'

export default class SceneManger
{
	constructor()
	{
		this.instance = new Scene()
		this.setModelGroup()
	}
	setModelGroup()
	{
		this.modelGroup = new Group()
		this.instance.add( this.modelGroup )
	}
}