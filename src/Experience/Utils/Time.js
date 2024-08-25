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
        this.delta = 16
		this.stats = new Stats()
		this.stats.showPanel(0)
		document.body.append(this.stats.dom)

		window.requestAnimationFrame(() =>
		{
			this.tick()
		})
    }

    tick()
    {
		this.stats.begin()
        const currentTime = Date.now()
        this.delta = ( currentTime - this.current ) * 0.001
        this.elapsed = ( this.current - this.start ) * 0.001
        this.current = currentTime

        this.trigger( 'tick' )

		this.stats.end()
        window.requestAnimationFrame(() =>
        {
            this.tick()
        })
    }
}