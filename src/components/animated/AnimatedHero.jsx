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
    return text.split(' ').map((word, wordIdx, wordsArr) => (
      <span key={wordIdx} className="inline-block whitespace-nowrap">
        {word.split('').map((char, i) => (
          <span key={i} className="title-char inline-block">
            {char}
          </span>
        ))}
        {wordIdx !== wordsArr.length - 1 && <span className="inline-block">&nbsp;</span>}      </span>
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
          {/* Slide 1: Who Am I? */}
          <section
            ref={(node) => {
              chapterRefs.current[0] = node
            }}
            className="content-section slide-who-am-i text-left items-start justify-center pointer-events-none"
          >
            <div className="w-full max-w-6xl px-6 sm:px-12 md:px-20 lg:px-28 flex justify-start items-center md:items-start pointer-events-auto">
              <div className="max-w-2xl text-center md:text-left flex flex-col items-center md:items-start gap-3 sm:gap-4 select-text">
                <span className="text-red-500 font-mono font-semibold tracking-[0.25em] text-xs sm:text-sm uppercase subtitle-line">
                  HELLO, I'M
                </span>
                
                <h1 className="hero-title-custom text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight uppercase leading-none -mt-2 sm:-mt-3 md:-mt-4 mb-2 sm:mb-3 md:mb-4">
                  {splitTitle("Hammam")}
                  <br className="block md:hidden" />
                  <span className="hidden md:inline">&nbsp;</span>
                  {splitTitle("Muhammad Yazid")}
                </h1>
                
                <div className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-500 via-rose-500 to-indigo-400 bg-clip-text text-transparent subtitle-line">
                  Backend Developer
                </div>
                
                <p className="text-sm sm:text-base md:text-lg text-slate-300 font-medium leading-relaxed max-w-lg subtitle-line">
                  Focused on API Engineering, Database Design, and Software Architecture.
                </p>
                
                <div className="text-xs sm:text-sm text-slate-400 font-normal flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2 subtitle-line">
                  <span>Computer Science Student at</span>
                  <span className="text-indigo-400 font-semibold">Universitas Gadjah Mada</span>
                </div>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4 subtitle-line">
                  <a
                    href="#projects"
                    className="px-5 py-2.5 rounded text-xs sm:text-sm font-medium bg-white text-black hover:bg-slate-200 transition-colors"
                  >
                    View Projects
                  </a>
                  <a
                    href="https://github.com/crispyrinux"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded text-xs sm:text-sm font-medium border border-white/20 text-white hover:bg-white/5 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                    </svg>
                    <span>GitHub</span>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/hammam-muhammad-yazid-14407b323"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded text-xs sm:text-sm font-medium border border-white/20 text-white hover:bg-white/5 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Slide 2: What I Do */}
          <section
            ref={(node) => {
              chapterRefs.current[1] = node
            }}
            className="content-section slide-what-i-do flex flex-col justify-center items-center px-6 w-full h-full pointer-events-none"
          >
            <div className="w-full max-w-4xl flex flex-col items-center gap-6 md:gap-8 select-text pointer-events-auto">
              <div className="text-center flex flex-col gap-1.5 md:gap-2">
                <span className="text-red-500 font-mono font-semibold tracking-[0.25em] text-xs sm:text-sm uppercase">
                  EXPERTISE
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight uppercase">
                  What I Do
                </h2>
              </div>
              
              <div className="flex flex-col items-start gap-6 md:gap-8 max-w-xl w-full border-l border-white/10 pl-6 sm:pl-8 py-2">
                <div className="flex flex-col gap-1 text-left">
                  <span className="text-xs font-mono text-red-500 tracking-wider font-semibold">
                    01 / API ENGINEERING
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                    Designing scalable backend services and REST APIs.
                  </h3>
                </div>

                <div className="flex flex-col gap-1 text-left">
                  <span className="text-xs font-mono text-red-500 tracking-wider font-semibold">
                    02 / DATABASE DESIGN
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                    Building efficient schemas, relationships, and query systems.
                  </h3>
                </div>

                <div className="flex flex-col gap-1 text-left">
                  <span className="text-xs font-mono text-red-500 tracking-wider font-semibold">
                    03 / SOFTWARE ARCHITECTURE
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                    Creating maintainable and scalable backend systems.
                  </h3>
                </div>
              </div>
            </div>
          </section>

          {/* Slide 3: Technologies */}
          <section
            ref={(node) => {
              chapterRefs.current[2] = node
            }}
            className="content-section slide-technologies flex flex-col justify-center items-center px-6 w-full h-full pointer-events-none"
          >
            <div className="w-full max-w-4xl flex flex-col items-center gap-6 md:gap-8 select-text pointer-events-auto">
              <div className="text-center flex flex-col gap-1.5 md:gap-2">
                <span className="text-indigo-400 font-mono font-semibold tracking-[0.25em] text-xs sm:text-sm uppercase">
                  TOOLKIT
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight uppercase">
                  Technologies I Work With
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 md:gap-16 w-full max-w-3xl text-left mt-2">
                <div className="flex flex-col gap-3">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-indigo-400 border-b border-white/10 pb-2 font-bold">
                    [ Backend ]
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-300">
                    {['Laravel', 'NestJS', 'Express.js', 'Node.js', 'PHP'].map((tech) => (
                      <li key={tech} className="flex items-center gap-2 font-medium">
                        <span className="w-1 h-1 bg-red-500 rounded-full" />
                        <span>{tech}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-indigo-400 border-b border-white/10 pb-2 font-bold">
                    [ Database ]
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-300">
                    {['PostgreSQL', 'MySQL', 'Redis'].map((tech) => (
                      <li key={tech} className="flex items-center gap-2 font-medium">
                        <span className="w-1 h-1 bg-indigo-500 rounded-full" />
                        <span>{tech}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-indigo-400 border-b border-white/10 pb-2 font-bold">
                    [ Tools ]
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-300">
                    {['Docker', 'Git', 'Linux'].map((tech) => (
                      <li key={tech} className="flex items-center gap-2 font-medium">
                        <span className="w-1 h-1 bg-teal-500 rounded-full" />
                        <span>{tech}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
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
