import Experience from "@/Experience/Experience.js";
import boardCoordinate from '@/Experience/Data/posterBoardCoordinate.js'

export default class PosterPage
{
	constructor()
	{
		this.experience = new Experience()
		this.sizes = this.experience.sizes
		this.isMobile = this.sizes.isMobile

		this.setTicketEnvelope()
		this.setBoard()
		this.setBoardSVGLine()
		this.setBoardImgSlide()
		this.setFinalPhoto()
	}

	setTicketEnvelope()
	{
		const ticketEnvelope = document.getElementById( 'ticketEnvelope' )
		const ticketSticker = document.getElementById( 'ticketSticker' )
		const ticketPaper = document.getElementById( 'ticketPaper' )
		const ticketCloseBtn = document.getElementById( 'ticketCloseBtn' )

		ticketSticker.addEventListener( 'click', () => {
			ticketEnvelope.classList.add( 'ticket__envelope-open' )
		})

		ticketCloseBtn.addEventListener( 'click', () => {
			ticketEnvelope.classList.remove( 'ticket__envelope-open' )
			ticketPaper.style.transform = 'translateX(-50%) scale(var(--scaleFactor))'

			requestAnimationFrame(() =>
			{
				ticketPaper.style.transform = 'translateX(-50%) scale(0.65)'
			})
		})
	}

	createDotElement( coord )
	{
		const dotElement = document.createElement( 'div' )
		dotElement.className = 'board__dot'
		dotElement.style.left = `${ coord.x }px`
		dotElement.style.top = `${ coord.y }px`

		return dotElement
	}

	setBoard()
	{
		const bardArea = document.querySelector( '.board__area' )
		const boardPolaroidWrap = document.getElementById( 'boardPolaroidWrap' )

		boardPolaroidWrap.addEventListener( 'mouseover', (e) => {
			if( this.isMobile ) return

			if( e.target.classList.contains( 'board__polaroid_img' ))
			{
				const polaroidImg = e.target
				polaroidImg.style.zIndex = 1
				const num = parseInt(polaroidImg.getAttribute( 'data-polaroid' )) - 1

				// 점 추가
				const dotCoordinate = boardCoordinate[ num ]
				for(let i = 0; i < dotCoordinate.length; i++) {
					const coord = dotCoordinate[i]
					const dotElement = this.createDotElement( coord )
					bardArea.appendChild( dotElement )
				}

				// 폴라로이드 애니메이션
				const rotateDeg = Math.random() * 5
				polaroidImg.style.transform = `rotate(${ rotateDeg }deg)`
				polaroidImg.addEventListener( 'mouseout', () => {
					const dotElements = document.querySelectorAll( '.board__dot' )
					const svgElement = document.querySelectorAll( '.board__line' )
					polaroidImg.style.zIndex = ''
					polaroidImg.style.transform = ''

					dotElements.forEach(( el ) => {
						el.style.opacity = 0
						el.addEventListener( 'transitionend', () => {
							el.remove()
						}, { once: true })
					}
					)
					svgElement.forEach(( el ) => {
						el.remove()
					}
					)
				}, { once: true })
			}
		})
	}

	setBoardSVGLine()
	{
		const boardPolaroidImg = document.querySelector( '.board__polaroid_img' )
		const boardPolaroidImgWidth = boardPolaroidImg.clientWidth
		const boardPolaroidImgHeight = boardPolaroidImg.clientHeight

		boardPolaroidWrap.addEventListener( 'mouseover', ( e ) => {
			if( this.isMobile ) return
			if( e.target.classList.contains( 'board__polaroid_img' ))
			{
				const polaroidImg = e.target
				const num = parseInt( polaroidImg.getAttribute( 'data-polaroid' ) ) - 1
				const dotCoordinate = boardCoordinate[ num ]

				const polaroidImgTop = polaroidImg.offsetTop
				const polaroidImgLeft = polaroidImg.offsetLeft

				const randomX = 0.2 + Math.random() * boardPolaroidImgWidth * 0.8
				const randomY = 0.2 + Math.random() * boardPolaroidImgHeight * 0.8

				const coord = { x: polaroidImgLeft + randomX, y: polaroidImgTop + randomY }

				const svgList = this.createSvgElement( coord, dotCoordinate )
				svgList.forEach(( svg ) => {
					boardPolaroidWrap.appendChild( svg )
				})
			}
		})
	}

	setBoardImgSlide()
	{
		let slideDirection = -1
		let zIndex = 1
		let isWaiting = false
		let prevTarget = null

		boardPolaroidWrap.addEventListener( 'click', (e) => {
			if( !this.isMobile ) return
			if( e.target.classList.contains( 'board__polaroid_img' ))
			{
				const target = e.target
				if( target === prevTarget ) return

				target.style.transition = 'transform 1s, opacity 0.3s 0.7s'
				target.style.transform = `translateX(${ ( this.sizes.width / 2 + 50 ) * slideDirection }px)`
				target.style.opacity = 0
				slideDirection *= -1

				prevTarget = target

				e.target.addEventListener( 'transitionend', (e) => {
					if ( e.propertyName !== 'transform' ) return

					isWaiting = false
					zIndex -= 1
					e.target.style.zIndex = zIndex
					e.target.style.transition = 'opacity 1s'
					e.target.style.opacity = 1
					e.target.style.transform = `rotate(${ 10 * ( Math.random() * 2 - 1 ) }deg)`
				})
			}
		})
	}

	createSvgElement( startCoord, dotCoords )
	{
		const startX = startCoord.x
		const startY = startCoord.y
		let svgList = []

		dotCoords.forEach( ( dotCoord ) => {
			const endX = dotCoord.x
			const endY = dotCoord.y

			const width = endX - startX
			const height = endY - startY

			const directionX = width > 0 ? 1 : -1
			const directionY = height > 0 ? 1 : -1

			const svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' )
			svg.setAttribute( 'viewBox', '-1, -1, 2, 2' )
			svg.setAttribute( 'width', width * directionX )
			svg.setAttribute( 'height', height * directionY )
			svg.setAttribute( 'preserveAspectRatio', 'none' )
			svg.setAttribute( 'class', 'board__line' )
			svg.style.left = `${ directionX > 0 ? startX : endX }px`
			svg.style.top = `${ directionY > 0 ? startY : endY }px`

			const path = document.createElementNS( 'http://www.w3.org/2000/svg', 'path' )
			path.setAttribute('d',
				`M${ -directionX },${ -directionY }
				C${ Math.random() * -1.2 },${ 0 }
				${ Math.random() * 1.2 },${ 0 }
				${ directionX },${ directionY }`
			)
			path.setAttribute( 'vector-effect', 'non-scaling-stroke' )
			path.setAttribute( 'class', 'board__line_path' )

			svg.appendChild( path )
			svgList.push( svg )
		})

		return svgList
	}

	setFinalPhoto()
	{
		const finalPhoto = document.querySelector( '#finalPhoto' )
		const finalAssets = document.querySelector( '#finalAssets' )
		const final = document.querySelector( '#final' )
		const finalWidth = final.clientWidth
		const finalHeight = final.clientHeight
		const coordWidth = finalWidth / 2
		const coordHeight = finalHeight / 2
		let finalAssetsMoving = false
		let finalAssetsCount = 1
		let initialX = finalPhoto.clientWidth / 2 * ( Math.random() * 2 - 1 )
		let initialY = finalPhoto.clientHeight / 2 * ( Math.random() * 2 - 1 )
		finalAssets.style.transform = `translate(calc(-50% + ${ initialX }px), calc(-50% + ${ initialY }px)) scale(0.6)`

		let isHovered = false;

		finalPhoto.addEventListener('mouseenter', () => {
			isHovered = true;
		});

		finalPhoto.addEventListener( 'mouseleave', () => {
			isHovered = false;
		});

		finalPhoto.addEventListener( 'mousemove', () => {
			if (finalAssetsMoving) return

			finalAssetsMoving = true

			const directionX = initialX > 0 ? 1 : -1
			const directionY = initialY > 0 ? 1 : -1
			const randomCoordX = initialX + coordWidth * ( Math.random() * 0.5 + 0.3 ) * directionX
			const randomCoordY = initialY + coordHeight * ( Math.random() * 0.5 + 0.3 )* directionY

			finalAssets.style.transition = 'transform 1s cubic-bezier(.69,.12,.24,1)'
			finalAssets.style.transform = `translate(calc(-50% + ${ randomCoordX }px), calc(-50% + ${ randomCoordY }px)) scale(1) rotate(${ 180 * Math.random() }deg)`

			finalAssets.classList.add( 'final__assets-fadein' )
		})

		finalAssets.addEventListener( 'transitionend', ( e ) => {
			if (e.propertyName !== 'transform') return; // transform만 처리

			finalAssetsMoving = false

			const finalAssetsId = finalAssetsCount % 12
			finalAssets.style.backgroundPosition = `left calc(var(--bgSize) * ${ -finalAssetsId }) center`
			finalAssetsCount += 1

			finalAssets.style.transition = 'none'
			initialX = finalPhoto.clientWidth / 2 * ( Math.random() * 2 - 1 )
			initialY = finalPhoto.clientHeight / 2 * ( Math.random() * 2 - 1 )
			finalAssets.style.transform = `translate(calc(-50% + ${ initialX }px), calc(-50% + ${ initialY }px)) scale(0.6)`

			finalAssets.classList.remove('final__assets-fadein')
		})
	}

	resize()
	{
		this.isMobile = this.sizes.isMobile
	}
}