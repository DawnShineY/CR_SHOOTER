export default class EventEmitter {
	constructor()
	{
		this.callbacks = {}
		this.callbacks.base = {}
	}

	on(_names, callback)
	{
		// Errors
		if(typeof _names === 'undefined', _names === '')
		{
			console.warn( 'wrong name' )
			return false
		}

		if(typeof callback === 'undefined')
		{
			console.warn( 'wrong callback' )
			return false
		}

		// Resolve names
		const names = this.resolveNames( _names )

		// Each name
		names.forEach(( _name ) =>{
			// Resolve name
			const name = this.resolveName( _name )

			// Create namespace if not exist
			if(!(this.callbacks[ name.namespace ] instanceof Object))
				this.callbacks[ name.namespace ] = {}

			// Create callbacks if not exist
			if(!(this.callbacks[ name.namespace ][ name.value ] instanceof Array))
				this.callbacks[ name.namespace ][ name.value ] = []

			// Add callbacks
			this.callbacks[ name.namespace ][ name.value ].push( callback )
		})

		return this
	}

	trigger( _name, _args )
	{
		// Errors
		if(typeof _name === 'undefined' || _name === '')
		{
			console.warn( 'wrong name' )
			return false
		}

		let finalResult = null
		let result = null

		// Default args
		const args = !(_args instanceof Array) ? [] : _args

		// Resolve names (should on have one event)
		let name = this.resolveNames(_name)

		// Resolve name
		name = this.resolveName( name[ 0 ] )

		// Default namespace
		if( name.namespace === 'base')
		{
			// Try to find callbacks in each namespace
			for(const namespace in this.callbacks)
			{
				if(this.callbacks[ namespace ] instanceof Object && this.callbacks[ namespace ][ name.value ] instanceof Array)
				{
					this.callbacks[ namespace ][ name.value ].forEach(( callback ) =>
					{
						result = callback.apply( this, args )

						if(typeof finalResult === 'undefined')
							finalResult = result
					})
				}
			}
		}

		// Specified namespace
		else if(this.callbacks[ name.namespace ] instanceof Object)
		{
			if(name.value === '')
			{
				console.warn( 'wrong name' )
				return false
			}

			this.callbacks[ name.namespace ][ name.value ].forEach(( callback ) =>
			{
				result = callback.apply( this, args )

				if(typeof finalResult === 'undefined')
					finalResult = result
			})
		}

		return finalResult
	}

	resolveNames( _names )
	{
		let names = _names
		names = names.replace( /[^a-zA-Z0-9 ,/.]/g, '' )
		names = names.replace( /[,/.]+/g, ' ' )
		names = names.split( ' ' )

		return names
	}

	resolveName( name )
	{
		const newName = {}
		const parts = name.split( '.' )

		newName.namespace = 'base'
		newName.value = name[ 0 ]

		// Specified namespace
		if(parts.length > 1 && parts[ 1 ] !== '')
			newName.namespace = parts[ 1 ]

		return newName
	}

}