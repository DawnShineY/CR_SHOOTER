function makeInteractionGroup( object, children )
{
	for(let child of children)
	{
		if(child.children.length && child.type === 'Object3D') // 자식이 있는 빈 객체
		{
			object[ child.name ] = {}
			makeInteractionGroup( object[ child.name ], child.children )
		}
		else if( child.inInstancedMesh ) // instanced mesh
		{
			object[ child.name ] = child
		}
		else if(child.type === 'Mesh' || child.type === 'LineSegments' || child.type === 'Object3D') // mesh 이거나 자식이 없는 빈 객체
		{
			if(child.children.length)
				makeInteractionGroup( object, child.children )

			object[child.name] = child
		}
	}
}

function setInteractionGroup(model, targetGroupName)
{
	const interactionObject = {}
	const interactionGroup = model.children.find(( child ) =>
	{
		return child.name === targetGroupName
	})

	makeInteractionGroup( interactionObject, interactionGroup.children )

	return interactionObject
}

export default setInteractionGroup
