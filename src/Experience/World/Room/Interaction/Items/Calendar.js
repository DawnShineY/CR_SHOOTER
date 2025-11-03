import Experience from '../../../../Experience.js'
import Interaction from '../Interaction.js'

export default class Calendar
{
	constructor(_interactionObjects)
	{
		this.experience = new Experience()
		this.intersectObjects = _interactionObjects
		this.calendar = this.intersectObjects.calendarGroup
		this.dateMesh = this.calendar.calendarDate
		this.dayMesh = this.calendar.calendarDay
		this.monthMesh = this.calendar.calendarMonth

		this.interaction = new Interaction()
		this.pointer = this.interaction.pointer
		this.setPointerEvent()

		this.getFullDate()
		this.setTexture()
	}

	setPointerEvent()
	{
		this.pointer.on('click', (obj) =>
		{
			if(obj === 'calendar')
			{
				console.log('this is calendar')
			}
		})
	}

	getFullDate()
	{
		this.fullDate = new Date()
		this.date = this.fullDate.getDate()
		this.day = this.fullDate.getDay() + 1
		this.month = this.fullDate.getMonth() + 1
	}

	setTexture()
	{
		this.dayMesh.material.map.offset.y += 0.125 * this.day
		this.dateMesh.material.map.offset.x += 0.2468 * ( Math.floor( this.date / 10 ))
		this.dateMesh.material.map.offset.y += 0.094 * ( this.date % 10 )
		this.monthMesh.material.map.offset.y += 0.077 * this.month
	}
}