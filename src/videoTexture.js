import * as THREE from 'three'

const videoElement = document.getElementById('video')
videoElement.volume = 0.2
videoElement.play()

const videoTexture = new THREE.VideoTexture( videoElement )
videoTexture.colorSpace = THREE.SRGBColorSpace
videoTexture.flipY = false
videoTexture.repeat.set(1.1, 1.4)
videoTexture.offset.y = - 0.2
videoTexture.offset.x = - 0.05
videoTexture.generateMipmaps = true
videoTexture.minFilter = THREE.LinearMipMapLinearFilter

export default videoTexture