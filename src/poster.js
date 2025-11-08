// Screen size check
const windowWidth = window.innerWidth
const isMobileSize = windowWidth < 768 ? true : false

// Ticket Envelope
const ticketEnvelope = document.getElementById('ticketEnvelope')
const ticketSticker = document.getElementById('ticketSticker')
const ticketPaper = document.getElementById('ticketPaper')

ticketSticker.addEventListener('click', (e) => {
	ticketEnvelope.classList.add('ticket__envelope-open')
})

const ticketCloseBtn = document.getElementById('ticketCloseBtn')
ticketCloseBtn.addEventListener('click', (e) => {
	ticketEnvelope.classList.remove('ticket__envelope-open')
	ticketPaper.style.transform = 'translateX(-50%) scale(var(--scaleFactor))'
	setTimeout(() =>
	{
		ticketPaper.style.transform = 'translateX(-50%) scale(0.65)'
	}, 0)
})

// Board Coordination
//document.querySelector('.board__area').addEventListener('click', (e) => {
//	console.log(e.offsetX, e.offsetY)
//})
//const boardCoordinate = [
//	[{x: 87, y: 562}],
//	[{x: 318, y: 105}],
//	[{x: 337, y: 182}, {x: 359, y: 505}],
//	[{x: 374, y: 204}],
//	[{x: 405, y: 142}, {x: 468, y: 264}, {x: 438, y: 296}],
//	[{x: 658, y: 286}],
//	[{x: 535, y: 500}],
//	[{x: 290, y: 520}, {x: 221, y: 498}],
//	[{x: 249, y: 598}, {x: 172, y: 564}, {x: 135, y: 519}],
//	[{x: 250, y: 792}],
//	[{x: 123, y: 1021}, {x: 266, y: 1028}, {x: 323, y: 1074}, {x: 603, y: 920}],
//	[{x: 525, y: 780}],
//	[{x: 366, y: 984}, {x: 496, y: 1172}],
//]
const boardCoordinate = [
	[{x: 353, y: 834}],
	[{x: 589, y: 374}],
	[{x: 599, y: 474}, {x: 631, y: 794}],
	[{x: 645, y: 480}],
	[{x: 671 , y: 406}, {x: 751 , y: 562}, {x: 695 , y: 564}],
	[{x: 934, y: 521}],
	[{x: 818, y: 791}],
	[{x: 460, y: 745}, {x: 574, y: 797}],
	[{x: 525 , y: 869}, {x: 432 , y: 855}, {x: 390 , y: 813}],
	[{x: 505 , y: 1010}],
	[{x: 403 , y: 1294}, {x: 532 , y: 1306}, {x: 594 , y: 1355}, {x: 867 , y: 1191}],
	[{x: 752 , y: 1066}],
	[{x: 758 , y: 1452}, {x: 654 , y: 1266}],
]

function createDotElement(coord) {
	const dotElement = document.createElement('div')
	dotElement.className = 'board__dot'
	dotElement.style.left = `${coord.x}px`
	dotElement.style.top = `${coord.y}px`

	return dotElement
}

const bardArea = document.querySelector('.board__area')
const boardImgWrap = document.getElementById('boardImgWrap')
const boardPolaroidWrap = document.getElementById('boardPolaroidWrap')
let prevPolaroid = null
let selectedPolaroid = null

if (!isMobileSize) { // Pc에서
	boardPolaroidWrap.addEventListener('mouseover', (e) => {
		if( e.target.classList.contains('board__polaroid_img')){
			const polaroidImg = e.target
			polaroidImg.style.zIndex = 1
			const num = parseInt(polaroidImg.getAttribute('data-polaroid')) - 1

			// 점 추가
			const dotCoordinate = boardCoordinate[num]
			for(let i = 0; i < dotCoordinate.length; i++) {
				const coord = dotCoordinate[i]
				const dotElement = createDotElement(coord)
				bardArea.appendChild(dotElement)
			}

			// 폴라로이드 애니메이션
			const rotateDeg = Math.random() * 5
			polaroidImg.style.transform = `rotate(${rotateDeg}deg)`

			polaroidImg.addEventListener('mouseout', () => {
				const dotElements = document.querySelectorAll('.board__dot')
				const svgElement = document.querySelectorAll('.board__line')
				polaroidImg.style.zIndex = ''
				polaroidImg.style.transform = ''

				dotElements.forEach((el) => {
					el.style.opacity = 0
					el.addEventListener('transitionend', () => {
						el.remove()
					}, {once: true})
				}
				)
				svgElement.forEach((el) => {
					el.remove()
				}
				)
			}, {once: true})
		}
	})
}

if(isMobileSize) {
	let slideDirection = -1
	let zIndex = 1
	let isWaiting = false
	let prevTarget = null

	boardPolaroidWrap.addEventListener('click', (e) => {
		if( e.target.classList.contains('board__polaroid_img')) {
			const target = e.target
			if(target === prevTarget) return

			target.style.transition = 'transform 1s, opacity 0.3s 0.7s'
			target.style.transform = `translateX(${(windowWidth / 2 + 50) * slideDirection}px)`
			target.style.opacity = 0
			slideDirection *= -1

			prevTarget = target

			e.target.addEventListener('transitionend', (e) => {
				if (e.propertyName !== 'transform') return

				isWaiting = false
				zIndex -= 1
				e.target.style.zIndex = zIndex
				e.target.style.transition = 'opacity 1s'
				e.target.style.opacity = 1
				e.target.style.transform = `rotate(${10 * (Math.random() * 2 - 1)}deg)`
			})
		}
	})
}


// 폴라로이드 선분 잇기
// 1. 폴라로이드 이미지 기준 점 찾기
const boardPolaroidWrapWidth = boardPolaroidWrap.clientWidth
const boardPolaroidImg = document.querySelector('.board__polaroid_img')
const boardPolaroidImgWidth = boardPolaroidImg.clientWidth
const boardPolaroidImgHeight = boardPolaroidImg.clientHeight

if (!isMobileSize) { // Pc에서
	boardPolaroidWrap.addEventListener('mouseover', (e) => {
		if( e.target.classList.contains('board__polaroid_img')){
			const polaroidImg = e.target
			const num = parseInt(polaroidImg.getAttribute('data-polaroid')) - 1
			const dotCoordinate = boardCoordinate[num]

			const polaroidImgTop = polaroidImg.offsetTop
			const polaroidImgLeft = polaroidImg.offsetLeft

			const randomX = 0.2 + Math.random() * boardPolaroidImgWidth * 0.8
			const randomY = 0.2 + Math.random() * boardPolaroidImgHeight * 0.8

			const coord = {x: polaroidImgLeft + randomX, y: polaroidImgTop + randomY}

			const svgList = createSvgElement(coord, dotCoordinate)
			svgList.forEach((svg) => {
				boardPolaroidWrap.appendChild(svg)
			})
		}
	})
}


function createSvgElement(startCoord, dotCoords) {
	const startX = startCoord.x
	const startY = startCoord.y
	let svgList = []

	dotCoords.forEach((dotCoord) => {
		const endX = dotCoord.x
		const endY = dotCoord.y

		const width = endX - startX
		const height = endY - startY

		const directionX = width > 0 ? 1 : -1
		const directionY = height > 0 ? 1 : -1

		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
		svg.setAttribute('viewBox', '-1, -1, 2, 2')
		svg.setAttribute('width', width * directionX)
		svg.setAttribute('height', height * directionY)
		svg.setAttribute('preserveAspectRatio', 'none')
		svg.setAttribute('class', 'board__line')
		svg.style.left = `${directionX > 0 ? startX : endX}px`
		svg.style.top = `${directionY > 0 ? startY : endY}px`

		const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
		path.setAttribute('d',
			`M${-directionX},${-directionY}
			C${Math.random() * -1.2},${0}
			${Math.random() * 1.2},${0}
			${directionX },${directionY}`
		)
		path.setAttribute('vector-effect', 'non-scaling-stroke')
		path.setAttribute('class', 'board__line_path')

		svg.appendChild(path)
		svgList.push(svg)
	})

	return svgList
}

const finalPhoto = document.querySelector('#finalPhoto')
const finalAssets = document.querySelector('#finalAssets')
const final = document.querySelector('#final')
const finalWidth = final.clientWidth
const finalHeight = final.clientHeight
const coordWidth = finalWidth / 2
const coordHeight = finalHeight / 2
let finalAssetsMoving = false
let finalAssetsCount = 1
let initialX = finalPhoto.clientWidth / 2 * (Math.random() * 2 - 1)
let initialY = finalPhoto.clientHeight / 2 * (Math.random() * 2 - 1)
finalAssets.style.transform = `translate(calc(-50% + ${initialX}px), calc(-50% + ${initialY}px)) scale(0.6)`

let isHovered = false;

finalPhoto.addEventListener('mouseenter', () => {
  isHovered = true;
});

finalPhoto.addEventListener('mouseleave', () => {
  isHovered = false;
});



finalPhoto.addEventListener('mousemove', () => {
	if (finalAssetsMoving) return

	finalAssetsMoving = true

	const directionX = initialX > 0 ? 1 : -1
	const directionY = initialY > 0 ? 1 : -1
	const randomCoordX = initialX + coordWidth * (Math.random() * 0.5 + 0.3) * directionX
	const randomCoordY = initialY + coordHeight * (Math.random() * 0.5 + 0.3)* directionY

	finalAssets.style.transition = 'transform 1s cubic-bezier(.69,.12,.24,1)'
	finalAssets.style.transform = `translate(calc(-50% + ${randomCoordX }px), calc(-50% + ${randomCoordY}px)) scale(1) rotate(${180 * Math.random()}deg)`

	finalAssets.classList.add('final__assets-fadein')
})


finalAssets.addEventListener('transitionend', (e) => {
	if (e.propertyName !== 'transform') return; // transform만 처리

	finalAssetsMoving = false

	const finalAssetsId = finalAssetsCount % 12
	finalAssets.style.backgroundPosition = `left calc(var(--bgSize) * ${-finalAssetsId}) center`
	finalAssetsCount += 1

	finalAssets.style.transition = 'none'
	initialX = finalPhoto.clientWidth / 2 * (Math.random() * 2 - 1)
	initialY = finalPhoto.clientHeight / 2 * (Math.random() * 2 - 1)
	finalAssets.style.transform = `translate(calc(-50% + ${initialX}px), calc(-50% + ${initialY}px)) scale(0.6)`

	finalAssets.classList.remove('final__assets-fadein')
})
