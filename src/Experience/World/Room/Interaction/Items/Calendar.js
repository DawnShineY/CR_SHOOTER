import gsap from 'gsap'
import Experience from '@/Experience/Experience.js'
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
		this.getFullDate()

		this.dateMesh.material.map.offset.y = 0
		this.monthMesh.material.map.offset.y = 0

		this.interaction = new Interaction()
		this.pointer = this.interaction.pointer
		this.setPointerEvent()
		this.resetPointerEvent()
	}

	setPointerEvent()
	{
		this.pointer.on('click', (obj) =>
		{
			if(obj === 'calendar')
			{
				gsap.to(
					this.dayMesh.material.map.offset,
					{
						y: this.dayMesh.material.map.offset.y + 0.125 * this.day,
						duration: 1,
						delay: 1.2,
						ease: 'power2.inOut'
					}
				)
				gsap.to(
					this.dateMesh.material.map.offset,
					{
						x: this.dateMesh.material.map.offset.x + 0.2468 * ( Math.floor( this.date / 10 )),
						duration: 0,
						delay: 1.5,
						ease: 'power2.inOut'
					}
				)
				gsap.to(
					this.dateMesh.material.map.offset,
					{
						y: this.dateMesh.material.map.offset.y + 0.094 * ( this.date % 10 ),
						duration: 1,
						delay: 1.5,
						ease: 'power2.inOut'
					}
				)
				gsap.to(
					this.monthMesh.material.map.offset,
					{
						y: this.monthMesh.material.map.offset.y + 0.077 * this.month,
						duration: 1,
						delay: 2.0,
						ease: 'power2.inOut'
					}
				)

			}
		})
	}
	resetPointerEvent()
	{
		this.pointer.on('reset', (obj) =>
		{
			gsap.to(
				this.dayMesh.material.map.offset,
				{
					y: 0,
					duration: 1,
					delay: 0,
					ease: 'power2.inOut'
				}
			)
			gsap.to(
				this.dateMesh.material.map.offset,
				{
					x: 0,
					duration: 0,
					delay: 0,
					ease: 'power2.inOut'
				}
			)
			gsap.to(
				this.dateMesh.material.map.offset,
				{
					y: 0,
					duration: 1,
					delay: 0,
					ease: 'power2.inOut'
				}
			)
			gsap.to(
				this.monthMesh.material.map.offset,
				{
					y: 0,
					duration: 1,
					delay: 0,
					ease: 'power2.inOut'
				}
			)
		})
	}

	getFullDate()
	{
		this.fullDate = new Date()
		this.date = this.fullDate.getDate()
		this.day = this.fullDate.getDay() + 1
		this.month = this.fullDate.getMonth() + 1
	}
}