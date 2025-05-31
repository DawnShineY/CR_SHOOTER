// Ticket Envelope
const ticketEnvelope = document.getElementById('ticketEnvelope')
const ticketSticker = document.getElementById('ticketSticker')

ticketSticker.addEventListener('click', (e) => {
	ticketEnvelope.classList.add('ticket__envelope-open')
})

const ticketCloseBtn = document.getElementById('ticketCloseBtn')
ticketCloseBtn.addEventListener('click', (e) => {
	ticketEnvelope.classList.remove('ticket__envelope-open')
	console.log('complete')
})

// Board Coordination
const boardCoordinate = [
	[{x: 84, y: 521}],
	[{x: 317, y: 83}],
	[{x: 330, y: 186}, {x: 359, y: 505}],
	[{x: 381, y: 203}],
	[{x: 431, y: 233}],
	[{x: 622, y: 234}],
	[{x: 525, y: 485}],
	[{x: 290, y: 520}, {x: 221, y: 498}],
	[{x: 249, y: 598}, {x: 172, y: 564}, {x: 135, y: 519}],
	[{x: 185, y: 750}],
	[{x: 123, y: 1021}, {x: 266, y: 1028}, {x: 323, y: 1074}, {x: 603, y: 908}],
	[{x: 600, y: 760}],
	[{x: 620, y: 1130}],
]

function createDotElement(coord) {
	const dotElement = document.createElement('div')
	dotElement.className = 'board__dot'
	dotElement.style.left = `${coord.x}px`
	dotElement.style.top = `${coord.y}px`

	return dotElement
}
const dotElement = document.createElement('div')
dotElement.className = 'board__bot'

const boardImgWrap = document.getElementById('boardImgWrap')
const boardPolaroidWrap = document.getElementById('boardPolaroidWrap')
boardPolaroidWrap.addEventListener('mouseover', (e) => {
	if( e.target.classList.contains('board__polaroid_img')){
		const polaroidImg = e.target
		const num = parseInt(polaroidImg.getAttribute('data-polaroid')) - 1

		const dotCoordinate = boardCoordinate[num]
		for(let i = 0; i < dotCoordinate.length; i++) {
			const coord = dotCoordinate[i]
			const dotElement = createDotElement(coord)
			boardImgWrap.appendChild(dotElement)
		}

		polaroidImg.addEventListener('mouseout', () => {
			const dotElements = document.querySelectorAll('.board__dot')
			dotElements.forEach(el => el.remove())
		}, {once: true})
	}
})