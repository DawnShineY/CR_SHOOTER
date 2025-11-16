import Stats from 'stats.js'
import EventEmitter from './EventEmitter.js'

export default class Time extends EventEmitter
{
    constructor()
    {
			super()

			// Setup
			this.start = Date.now()
			this.current = this.start
			this.elapsed = 0
			this.delta = 0.016

			this.active = window.location.hash === '#debug'

			if(this.active)
			{
				this.stats = new Stats()
				this.stats.domElement.style.top = 'calc(100vh - 48px)'
				this.stats.domElement.style.left = 'calc(100vw - 80px)'

				this.stats.showPanel(0)
				document.body.append(this.stats.dom)

				window.requestAnimationFrame(() =>
				{
					this.debugTick()
				})
			}
			else
			{
				window.requestAnimationFrame(() =>
				{
					this.tick()
				})
			}

    }

    debugTick()
    {
			this.stats.begin()
			const currentTime = Date.now()
			this.delta = ( currentTime - this.current ) * 0.001
			this.elapsed = ( this.current - this.start ) * 0.001
			this.current = currentTime

			this.tickCount++
			this.newTime += this.delta

			this.trigger( 'tick' )

			this.stats.end()
			window.requestAnimationFrame(() =>
			{
				this.debugTick()
			})
    }

		tick()
    {
			const currentTime = Date.now()
			this.delta = ( currentTime - this.current ) * 0.001
			this.elapsed = ( this.current - this.start ) * 0.001
			this.current = currentTime

			this.tickCount++
			this.newTime += this.delta

			this.trigger( 'tick' )

			window.requestAnimationFrame(() =>
			{
				this.tick()
			})
    }
}