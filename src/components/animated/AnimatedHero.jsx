import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import './AnimatedHero.css'

gsap.registerPlugin(ScrollTrigger)

const chapters = [
  {
    title: 'DEVELOPER',
    line1: 'Backend Developer Focused on API Engineering,',
    line2: 'Database Design, and Software Architecture.',
  },
  {
    title: 'SYSTEMS',
    line1: 'Building scalable backend systems through well-designed APIs,',
    line2: 'structured databases, and maintainable software architecture.',
  },
  {
    title: 'PORTFOLIO',
    line1: 'Hammam Muhammad Yazid — Computer Science Student',
    line2: 'at Universitas Gadjah Mada.',
  },
]

const getOptimalPixelRatio = () => {
  if (typeof window === 'undefined') return 1
  const dpr = window.devicePixelRatio || 1
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
  const cores = navigator.hardwareConcurrency || 4
  const isLowEnd = cores <= 4 || isMobile

  if (isMobile) return 1.0
  if (isLowEnd) return 1.0
  return Math.min(dpr, 1.5)
}

const checkPostProcessingSupport = () => {
  if (typeof window === 'undefined') return false
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
  const cores = navigator.hardwareConcurrency || 4
  return !isMobile && cores > 4
}

export default function AnimatedHero() {
  const containerRef = useRef(null)
  const stageRef = useRef(null)
  const canvasRef = useRef(null)
  const chapterRefs = useRef([])
  const scrollProgressRef = useRef(null)
  const progressFillRef = useRef(null)
  const menuRef = useRef(null)

  const smoothCameraPos = useRef({ x: 0, y: 30, z: 100 })
  const targetScrollProgress = useRef(0)
  const smoothScrollProgress = useRef(0)
  const activeSectionRef = useRef(0)

  const [currentSection, setCurrentSection] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const totalSections = chapters.length

  const threeRefs = useRef({
    scene: null,
    camera: null,
    renderer: null,
    composer: null,
    stars: [],
    nebula: null,
    mountains: [],
    atmosphere: null,
    locations: [],
    animationId: null,
  })

  useEffect(() => {
    const initThree = () => {
      const { current: refs } = threeRefs
      const stage = stageRef.current
      const width = stage?.clientWidth || window.innerWidth
      const height = stage?.clientHeight || window.innerHeight

      refs.scene = new THREE.Scene()
      refs.scene.fog = new THREE.FogExp2(0x000000, 0.00025)

      refs.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 2000)
      refs.camera.position.z = 100
      refs.camera.position.y = 20
      refs.targetCameraX = 0
      refs.targetCameraY = 30
      refs.targetCameraZ = 300

      refs.renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      })
      refs.renderer.setSize(width, height)
      refs.renderer.setPixelRatio(getOptimalPixelRatio())
      refs.renderer.setClearColor(0x000000, 1)
      refs.renderer.toneMapping = THREE.ACESFilmicToneMapping
      refs.renderer.toneMappingExposure = 0.5

      if (checkPostProcessingSupport()) {
        refs.composer = new EffectComposer(refs.renderer)
        const renderPass = new RenderPass(refs.scene, refs.camera)
        refs.composer.addPass(renderPass)

        const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 0.8, 0.4, 0.85)
        refs.composer.addPass(bloomPass)
      } else {
        refs.composer = null
      }

      createStarField()
      createNebula()
      createMountains()
      createAtmosphere()
      getLocation()
      animate()
      setIsReady(true)
    }

    const createStarField = () => {
      const { current: refs } = threeRefs
      const starCount = 5000

      for (let i = 0; i < 3; i += 1) {
        const geometry = new THREE.BufferGeometry()
        const positions = new Float32Array(starCount * 3)
        const colors = new Float32Array(starCount * 3)
        const sizes = new Float32Array(starCount)

        for (let j = 0; j < starCount; j += 1) {
          const radius = 200 + Math.random() * 800
          const theta = Math.random() * Math.PI * 2
          const phi = Math.acos(Math.random() * 2 - 1)

          positions[j * 3] = radius * Math.sin(phi) * Math.cos(theta)
          positions[j * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
          positions[j * 3 + 2] = radius * Math.cos(phi)

          const color = new THREE.Color()
          const colorChoice = Math.random()

          if (colorChoice < 0.7) {
            color.setHSL(0, 0, 0.8 + Math.random() * 0.2)
          } else if (colorChoice < 0.9) {
            color.setHSL(0.08, 0.5, 0.8)
          } else {
            color.setHSL(0.6, 0.5, 0.8)
          }

          colors[j * 3] = color.r
          colors[j * 3 + 1] = color.g
          colors[j * 3 + 2] = color.b
          sizes[j] = Math.random() * 2 + 0.5
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

        const material = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            depth: { value: i },
          },
          vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            uniform float time;
            uniform float depth;

            void main() {
              vColor = color;
              vec3 pos = position;

              float angle = time * 0.05 * (1.0 - depth * 0.3);
              mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
              pos.xy = rot * pos.xy;

              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              gl_PointSize = size * (300.0 / -mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            varying vec3 vColor;

            void main() {
              float dist = length(gl_PointCoord - vec2(0.5));
              if (dist > 0.5) discard;

              // Soft exponential glow decay for a more stellar atmospheric corona
              float glow = exp(-dist * 6.0);
              gl_FragColor = vec4(vColor, glow);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })

        const stars = new THREE.Points(geometry, material)
        refs.scene.add(stars)
        refs.stars.push(stars)
      }
    }

    const createNebula = () => {
      const { current: refs } = threeRefs

      const geometry = new THREE.PlaneGeometry(8000, 4000, 100, 100)
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color1: { value: new THREE.Color(0x0033ff) },
          color2: { value: new THREE.Color(0xff0066) },
          opacity: { value: 0.3 },
        },
        vertexShader: `
          varying vec2 vUv;
          varying float vElevation;
          uniform float time;

          void main() {
            vUv = uv;
            vec3 pos = position;

            float elevation = sin(pos.x * 0.01 + time) * cos(pos.y * 0.01 + time) * 20.0;
            pos.z += elevation;
            vElevation = elevation;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color1;
          uniform vec3 color2;
          uniform float opacity;
          uniform float time;
          varying vec2 vUv;
          varying float vElevation;

          void main() {
            float mixFactor = sin(vUv.x * 10.0 + time) * cos(vUv.y * 10.0 + time);
            vec3 color = mix(color1, color2, mixFactor * 0.5 + 0.5);

            float alpha = opacity * (1.0 - length(vUv - 0.5) * 2.0);
            alpha *= 1.0 + vElevation * 0.01;

            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.FrontSide,
        depthWrite: false,
      })

      const nebula = new THREE.Mesh(geometry, material)
      nebula.position.z = -1050
      nebula.rotation.x = 0
      refs.scene.add(nebula)
      refs.nebula = nebula
    }

    const createMountains = () => {
      const { current: refs } = threeRefs

      const layers = [
        { distance: -50, height: 60, color: 0x1a1a2e, opacity: 1 },
        { distance: -100, height: 80, color: 0x16213e, opacity: 0.8 },
        { distance: -150, height: 100, color: 0x0f3460, opacity: 0.6 },
        { distance: -200, height: 120, color: 0x0a4668, opacity: 0.4 },
      ]

      layers.forEach((layer, index) => {
        const points = []
        const segments = 96

        for (let i = 0; i <= segments; i += 1) {
          const x = (i / segments - 0.5) * 1000
          const y =
            Math.sin(i * 0.1) * layer.height +
            Math.sin(i * 0.05) * layer.height * 0.5 +
            Math.random() * layer.height * 0.2 -
            100

          points.push(new THREE.Vector2(x, y))
        }

        points.push(new THREE.Vector2(5000, -300))
        points.push(new THREE.Vector2(-5000, -300))

        const shape = new THREE.Shape(points)
        const geometry = new THREE.ShapeGeometry(shape)
        const material = new THREE.MeshBasicMaterial({
          color: layer.color,
          transparent: true,
          opacity: layer.opacity,
          side: THREE.DoubleSide,
        })

        const mountain = new THREE.Mesh(geometry, material)
        mountain.position.z = layer.distance
        mountain.position.y = layer.distance
        mountain.userData = { baseZ: layer.distance, index }
        refs.scene.add(mountain)
        refs.mountains.push(mountain)
      })
    }

    const createAtmosphere = () => {
      const { current: refs } = threeRefs

      const geometry = new THREE.SphereGeometry(600, 32, 32)
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;

          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          uniform float time;

          void main() {
            // Enhanced rim-glow by lowering power to 1.5 and boosting multiplier to 1.2 (reduced by 20% from 1.5)
            float intensity = pow(0.85 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 1.5);
            vec3 atmosphere = vec3(0.3, 0.6, 1.0) * intensity * 1.2;

            float pulse = sin(time * 2.0) * 0.08 + 0.92;
            atmosphere *= pulse;

            gl_FragColor = vec4(atmosphere, intensity * 0.24);
          }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
      })

      const atmosphere = new THREE.Mesh(geometry, material)
      refs.scene.add(atmosphere)
      refs.atmosphere = atmosphere
    }

    const applyScrollProgress = (progress) => {
      const container = containerRef.current
      const { current: refs } = threeRefs

      if (!container || !refs.nebula || refs.mountains.length === 0) {
        return
      }

      const scrollableDistance = Math.max(container.offsetHeight - window.innerHeight, 1)
      const localScrollY = progress * scrollableDistance
      const chapterProgress = progress * (totalSections - 1)
      const nextSection = Math.min(totalSections - 1, Math.max(0, Math.round(chapterProgress)))

      if (activeSectionRef.current !== nextSection) {
        activeSectionRef.current = nextSection
        setCurrentSection(nextSection)
      }

      chapterRefs.current.forEach((section, index) => {
        if (!section) return

        const offset = index - chapterProgress
        const distance = offset * 100
        const distanceAbs = Math.abs(offset)
        const opacity = Math.max(0, 1 - distanceAbs * 1.35)
        const scale = 1 - Math.min(distanceAbs * 0.075, 0.12)

        section.style.transform = `translate3d(0, ${distance}vh, 0) scale(${scale})`
        section.style.opacity = opacity
        section.style.pointerEvents = distanceAbs < 0.42 ? 'auto' : 'none'
      })

      const cameraPositions = [
        { x: 0, y: 30, z: 300 },
        { x: 0, y: 40, z: -50 },
        { x: 0, y: 50, z: -700 },
      ]
      const totalProgress = progress * (cameraPositions.length - 1)
      const cameraIndex = Math.min(cameraPositions.length - 2, Math.floor(totalProgress))
      const sectionProgress = totalProgress - cameraIndex
      const easedSectionProgress = sectionProgress * sectionProgress * (3 - 2 * sectionProgress)
      const currentPos = cameraPositions[cameraIndex]
      const nextPos = cameraPositions[cameraIndex + 1]

      refs.targetCameraX = currentPos.x + (nextPos.x - currentPos.x) * easedSectionProgress
      refs.targetCameraY = currentPos.y + (nextPos.y - currentPos.y) * easedSectionProgress
      refs.targetCameraZ = currentPos.z + (nextPos.z - currentPos.z) * easedSectionProgress

      refs.mountains.forEach((mountain, index) => {
        const speed = 1 + index * 0.9
        const baseZ = refs.locations[index] ?? mountain.userData.baseZ
        const targetZ = baseZ + localScrollY * speed * 0.5

        mountain.userData.targetZ = targetZ
        mountain.position.z = targetZ
      })

      refs.nebula.position.z = refs.mountains[3]?.position.z ?? -1050

      if (progressFillRef.current) {
        progressFillRef.current.style.transform = `scaleX(${Math.max(progress, 0.04)})`
      }
    }

    const animate = () => {
      const { current: refs } = threeRefs
      refs.animationId = requestAnimationFrame(animate)

      const time = Date.now() * 0.001
      const scrollSmoothing = 0.072

      const diff = targetScrollProgress.current - smoothScrollProgress.current
      if (Math.abs(diff) > 0.0001) {
        smoothScrollProgress.current += diff * scrollSmoothing
        applyScrollProgress(smoothScrollProgress.current)
      } else if (smoothScrollProgress.current !== targetScrollProgress.current) {
        smoothScrollProgress.current = targetScrollProgress.current
        applyScrollProgress(smoothScrollProgress.current)
      }

      refs.stars.forEach((starField) => {
        if (starField.material.uniforms) {
          starField.material.uniforms.time.value = time
        }
      })

      if (refs.nebula && refs.nebula.material.uniforms) {
        refs.nebula.material.uniforms.time.value = time * 0.5
      }

      if (refs.camera && refs.targetCameraX !== undefined) {
        const smoothingFactor = 0.05

        smoothCameraPos.current.x += (refs.targetCameraX - smoothCameraPos.current.x) * smoothingFactor
        smoothCameraPos.current.y += (refs.targetCameraY - smoothCameraPos.current.y) * smoothingFactor
        smoothCameraPos.current.z += (refs.targetCameraZ - smoothCameraPos.current.z) * smoothingFactor

        const floatX = Math.sin(time * 0.1) * 2
        const floatY = Math.cos(time * 0.15) * 1

        refs.camera.position.x = smoothCameraPos.current.x + floatX
        refs.camera.position.y = smoothCameraPos.current.y + floatY
        refs.camera.position.z = smoothCameraPos.current.z
        refs.camera.lookAt(0, 10, -600)
      }

      refs.mountains.forEach((mountain, i) => {
        const parallaxFactor = 1 + i * 0.5
        mountain.position.x = Math.sin(time * 0.1) * 2 * parallaxFactor
        mountain.position.y = 50 + Math.cos(time * 0.15) * 1 * parallaxFactor
      })

      if (refs.composer) {
        refs.composer.render()
      } else if (refs.renderer && refs.scene && refs.camera) {
        refs.renderer.render(refs.scene, refs.camera)
      }
    }

    initThree()

    const handleResize = () => {
      const { current: refs } = threeRefs
      const stage = stageRef.current
      const width = stage?.clientWidth || window.innerWidth
      const height = stage?.clientHeight || window.innerHeight

      if (refs.camera && refs.renderer) {
        refs.camera.aspect = width / height
        refs.camera.updateProjectionMatrix()
        refs.renderer.setSize(width, height)
        if (refs.composer) {
          refs.composer.setSize(width, height)
        }
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      const { current: refs } = threeRefs

      if (refs.animationId) {
        cancelAnimationFrame(refs.animationId)
      }

      window.removeEventListener('resize', handleResize)

      refs.stars.forEach((starField) => {
        starField.geometry.dispose()
        starField.material.dispose()
      })

      refs.mountains.forEach((mountain) => {
        mountain.geometry.dispose()
        mountain.material.dispose()
      })

      if (refs.nebula) {
        refs.nebula.geometry.dispose()
        refs.nebula.material.dispose()
      }

      if (refs.atmosphere) {
        refs.atmosphere.geometry.dispose()
        refs.atmosphere.material.dispose()
      }

      if (refs.composer) {
        refs.composer.dispose()
      }

      if (refs.renderer) {
        refs.renderer.dispose()
      }
    }
  }, [])

  const getLocation = () => {
    const { current: refs } = threeRefs
    const locations = []

    refs.mountains.forEach((mountain, i) => {
      locations[i] = mountain.position.z
    })

    refs.locations = locations
  }

  useEffect(() => {
    if (!isReady) return undefined

    const visibleTargets = [menuRef.current, scrollProgressRef.current, ...chapterRefs.current].filter(Boolean)

    gsap.set(visibleTargets, {
      visibility: 'visible',
    })

    const tl = gsap.timeline({
      defaults: {
        overwrite: 'auto',
      },
    })

    if (menuRef.current && currentSection === 0) {
      tl.from(menuRef.current, {
        x: -100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      })
    }

    const firstChapter = chapterRefs.current[0]

    if (firstChapter) {
      const titleChars = firstChapter.querySelectorAll('.title-char')
      tl.from(titleChars, {
        y: 200,
        opacity: 0,
        duration: 1.5,
        stagger: 0.05,
        ease: 'power4.out',
      }, '-=0.5')
    }

    if (firstChapter) {
      const subtitleLines = firstChapter.querySelectorAll('.subtitle-line')
      tl.from(subtitleLines, {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
      }, '-=0.8')
    }

    if (scrollProgressRef.current && currentSection === 0) {
      tl.from(scrollProgressRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power2.out',
      }, '-=0.5')
    }

    return () => {
      tl.kill()
    }
  }, [isReady])

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current

      if (!container) {
        return
      }

      const rect = container.getBoundingClientRect()
      const scrollableDistance = Math.max(rect.height - window.innerHeight, 1)
      const progress = Math.min(Math.max(-rect.top / scrollableDistance, 0), 1)

      targetScrollProgress.current = progress
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [totalSections])

  const splitTitle = (text) => {
    return text.split('').map((char, i) => (
      <span key={i} className="title-char">
        {char}
      </span>
    ))
  }

  return (
    <div ref={containerRef} className="hero-container cosmos-style">
      <div ref={stageRef} className="hero-stage">
        <canvas ref={canvasRef} className="hero-canvas" />

        <div ref={menuRef} className="side-menu" style={{ visibility: 'hidden' }}>
          <div className="menu-icon">
            <span />
            <span />
            <span />
          </div>
          <div className="vertical-text">HMY</div>
        </div>

        <div className="scroll-sections hero-content cosmos-content">
          {chapters.map((chapter, index) => (
            <section
              key={chapter.title}
              ref={(node) => {
                chapterRefs.current[index] = node
              }}
              className="content-section"
            >
              <h1 className="hero-title">{splitTitle(chapter.title)}</h1>

              <div className="hero-subtitle cosmos-subtitle">
                <p className="subtitle-line">{chapter.line1}</p>
                <p className="subtitle-line">{chapter.line2}</p>
              </div>
            </section>
          ))}
        </div>

        <div ref={scrollProgressRef} className="scroll-progress" style={{ visibility: 'hidden' }}>
          <div className="scroll-text">SCROLL</div>
          <div className="progress-track">
            <div ref={progressFillRef} className="progress-fill" />
          </div>
          <div className="section-counter">
            {String(currentSection + 1).padStart(2, '0')} / {String(totalSections).padStart(2, '0')}
          </div>
        </div>
      </div>
    </div>
  )
}
