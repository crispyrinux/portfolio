import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

gsap.registerPlugin(ScrollTrigger)

const roles = ['Backend Developer', 'Software Engineer', 'Computer Science Student']

const chapters = [
  {
    title: 'PROJECTS',
    description: 'Selected builds, academic work, cloud experiments, and case studies.',
  },
  {
    title: 'LAB',
    description: 'Where ideas become systems, and experiments become documented products.',
  },
]

function disposeMaterial(material) {
  if (Array.isArray(material)) {
    material.forEach((item) => item.dispose())
    return
  }

  material?.dispose()
}

export default function AnimatedHero() {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const sideRef = useRef(null)
  const rolesRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const chaptersRef = useRef(null)
  const ctaRef = useRef(null)
  const progressFillRef = useRef(null)

  const cameraTargetRef = useRef({ x: 0, y: 24, z: 145 })
  const smoothCameraRef = useRef({ x: 0, y: 24, z: 145 })

  const threeRefs = useRef({
    scene: null,
    camera: null,
    renderer: null,
    composer: null,
    bloomPass: null,
    objects: [],
    stars: [],
    mountains: [],
    nebula: null,
    atmosphere: null,
    grid: null,
    animationId: null,
    scrollTrigger: null,
  })

  useEffect(() => {
    const section = sectionRef.current
    const canvas = canvasRef.current

    if (!section || !canvas) {
      return undefined
    }

    const refs = threeRefs.current
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const clock = new THREE.Clock()

    const getSize = () => {
      const rect = section.getBoundingClientRect()
      return {
        width: Math.max(rect.width, 1),
        height: Math.max(rect.height, 1),
      }
    }

    const { width, height } = getSize()

    refs.scene = new THREE.Scene()
    refs.scene.fog = new THREE.FogExp2(0x030711, 0.0012)

    refs.camera = new THREE.PerspectiveCamera(64, width / height, 0.1, 1600)
    refs.camera.position.set(0, 24, 145)
    refs.camera.lookAt(0, -8, -240)

    refs.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    refs.renderer.setSize(width, height)
    refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    refs.renderer.toneMapping = THREE.ACESFilmicToneMapping
    refs.renderer.toneMappingExposure = 0.65

    refs.composer = new EffectComposer(refs.renderer)
    refs.composer.setSize(width, height)
    refs.composer.addPass(new RenderPass(refs.scene, refs.camera))

    refs.bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 0.58, 0.34, 0.82)
    refs.composer.addPass(refs.bloomPass)

    const createStarField = () => {
      const isMobile = width < 768
      const starCount = isMobile ? 850 : 1600

      for (let layer = 0; layer < 2; layer += 1) {
        const geometry = new THREE.BufferGeometry()
        const positions = new Float32Array(starCount * 3)
        const colors = new Float32Array(starCount * 3)
        const sizes = new Float32Array(starCount)

        for (let i = 0; i < starCount; i += 1) {
          const radius = 170 + Math.random() * (520 + layer * 260)
          const theta = Math.random() * Math.PI * 2
          const phi = Math.acos(Math.random() * 2 - 1)

          positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
          positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
          positions[i * 3 + 2] = radius * Math.cos(phi) - 190

          const color = new THREE.Color()
          const colorChoice = Math.random()

          if (colorChoice < 0.72) {
            color.setHSL(0.62, 0.18, 0.82 + Math.random() * 0.14)
          } else if (colorChoice < 0.9) {
            color.setHSL(0.58, 0.58, 0.75)
          } else {
            color.setHSL(0.76, 0.42, 0.78)
          }

          colors[i * 3] = color.r
          colors[i * 3 + 1] = color.g
          colors[i * 3 + 2] = color.b
          sizes[i] = Math.random() * 1.8 + 0.4
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

        const material = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            depth: { value: layer },
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
              float angle = time * 0.025 * (1.0 - depth * 0.25);
              mat2 rotation = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
              pos.xy = rotation * pos.xy;

              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              gl_PointSize = size * (250.0 / -mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            varying vec3 vColor;

            void main() {
              float dist = length(gl_PointCoord - vec2(0.5));
              if (dist > 0.5) discard;
              float opacity = 1.0 - smoothstep(0.0, 0.5, dist);
              gl_FragColor = vec4(vColor, opacity);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })

        const stars = new THREE.Points(geometry, material)
        refs.scene.add(stars)
        refs.stars.push(stars)
        refs.objects.push(stars)
      }
    }

    const createNebula = () => {
      const segmentCount = width < 768 ? 28 : 48
      const geometry = new THREE.PlaneGeometry(900, 420, segmentCount, Math.max(16, Math.floor(segmentCount / 2)))
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color1: { value: new THREE.Color(0x1d4ed8) },
          color2: { value: new THREE.Color(0x7c3aed) },
          opacity: { value: 0.28 },
        },
        vertexShader: `
          varying vec2 vUv;
          varying float vElevation;
          uniform float time;

          void main() {
            vUv = uv;
            vec3 pos = position;
            float elevation = sin(pos.x * 0.012 + time) * cos(pos.y * 0.015 + time) * 12.0;
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
            float mixFactor = sin(vUv.x * 9.0 + time) * cos(vUv.y * 7.0 + time);
            vec3 color = mix(color1, color2, mixFactor * 0.5 + 0.5);
            float alpha = opacity * (1.0 - length(vUv - 0.5) * 1.55);
            alpha *= 1.0 + vElevation * 0.015;
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
      })

      refs.nebula = new THREE.Mesh(geometry, material)
      refs.nebula.position.set(0, 65, -410)
      refs.scene.add(refs.nebula)
      refs.objects.push(refs.nebula)
    }

    const createHorizon = () => {
      refs.grid = new THREE.GridHelper(540, 44, 0x7c8cff, 0x1e293b)
      refs.grid.position.set(0, -46, -100)
      refs.grid.material.transparent = true
      refs.grid.material.opacity = 0.18
      refs.scene.add(refs.grid)
      refs.objects.push(refs.grid)

      const layers = [
        { z: -82, y: -38, height: 38, color: 0x111827, opacity: 0.96 },
        { z: -120, y: -34, height: 50, color: 0x172554, opacity: 0.66 },
        { z: -164, y: -30, height: 68, color: 0x312e81, opacity: 0.34 },
      ]

      layers.forEach((layer, layerIndex) => {
        const points = []
        const segments = 42

        for (let i = 0; i <= segments; i += 1) {
          const x = (i / segments - 0.5) * 700
          const y =
            Math.sin(i * 0.52 + layerIndex) * layer.height * 0.25 +
            Math.sin(i * 0.17 + layerIndex * 1.8) * layer.height * 0.5
          points.push(new THREE.Vector2(x, y))
        }

        points.push(new THREE.Vector2(390, -120))
        points.push(new THREE.Vector2(-390, -120))

        const shape = new THREE.Shape(points)
        const geometry = new THREE.ShapeGeometry(shape)
        const material = new THREE.MeshBasicMaterial({
          color: layer.color,
          transparent: true,
          opacity: layer.opacity,
          side: THREE.DoubleSide,
        })

        const mountain = new THREE.Mesh(geometry, material)
        mountain.position.set(0, layer.y, layer.z)
        mountain.userData = {
          baseX: 0,
          drift: 0.18 + layerIndex * 0.12,
        }

        refs.scene.add(mountain)
        refs.mountains.push(mountain)
        refs.objects.push(mountain)
      })
    }

    const createAtmosphere = () => {
      const geometry = new THREE.SphereGeometry(360, 32, 24)
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
        },
        vertexShader: `
          varying vec3 vNormal;

          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          uniform float time;

          void main() {
            float intensity = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            vec3 atmosphere = vec3(0.35, 0.55, 1.0) * intensity;
            float pulse = sin(time * 1.2) * 0.06 + 0.94;
            atmosphere *= pulse;
            gl_FragColor = vec4(atmosphere, intensity * 0.2);
          }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      })

      refs.atmosphere = new THREE.Mesh(geometry, material)
      refs.atmosphere.position.set(0, -22, -250)
      refs.scene.add(refs.atmosphere)
      refs.objects.push(refs.atmosphere)
    }

    const animate = () => {
      refs.animationId = requestAnimationFrame(animate)
      const time = clock.getElapsedTime()
      const smoothing = reducedMotion ? 0.12 : 0.045

      smoothCameraRef.current.x += (cameraTargetRef.current.x - smoothCameraRef.current.x) * smoothing
      smoothCameraRef.current.y += (cameraTargetRef.current.y - smoothCameraRef.current.y) * smoothing
      smoothCameraRef.current.z += (cameraTargetRef.current.z - smoothCameraRef.current.z) * smoothing

      const floatX = reducedMotion ? 0 : Math.sin(time * 0.16) * 1.2
      const floatY = reducedMotion ? 0 : Math.cos(time * 0.12) * 0.9

      refs.camera.position.set(
        smoothCameraRef.current.x + floatX,
        smoothCameraRef.current.y + floatY,
        smoothCameraRef.current.z,
      )
      refs.camera.lookAt(0, -8, -235)

      refs.stars.forEach((starField) => {
        if (starField.material.uniforms) {
          starField.material.uniforms.time.value = time
        }
      })

      if (refs.nebula?.material.uniforms) {
        refs.nebula.material.uniforms.time.value = time * 0.42
      }

      if (refs.atmosphere?.material.uniforms) {
        refs.atmosphere.material.uniforms.time.value = time
      }

      refs.mountains.forEach((mountain, index) => {
        if (!reducedMotion) {
          mountain.position.x = Math.sin(time * mountain.userData.drift) * (1.5 + index)
        }
      })

      refs.composer.render()
    }

    createStarField()
    createNebula()
    createHorizon()
    createAtmosphere()
    animate()

    const handleResize = () => {
      const nextSize = getSize()

      refs.camera.aspect = nextSize.width / nextSize.height
      refs.camera.updateProjectionMatrix()
      refs.renderer.setSize(nextSize.width, nextSize.height)
      refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
      refs.composer.setSize(nextSize.width, nextSize.height)
      refs.bloomPass.setSize(nextSize.width, nextSize.height)
    }

    window.addEventListener('resize', handleResize)

    refs.scrollTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress
        cameraTargetRef.current.x = (progress - 0.5) * 9
        cameraTargetRef.current.y = 24 + progress * 11
        cameraTargetRef.current.z = 145 - progress * 34

        if (progressFillRef.current) {
          progressFillRef.current.style.transform = `scaleX(${Math.max(progress, 0.04)})`
        }
      },
    })

    return () => {
      if (refs.animationId) {
        cancelAnimationFrame(refs.animationId)
      }

      window.removeEventListener('resize', handleResize)
      refs.scrollTrigger?.kill()

      refs.objects.forEach((object) => {
        object.geometry?.dispose()
        disposeMaterial(object.material)
        refs.scene?.remove(object)
      })

      refs.composer?.dispose?.()
      refs.bloomPass?.dispose?.()
      refs.renderer?.dispose()
      refs.renderer?.forceContextLoss?.()

      refs.scene = null
      refs.camera = null
      refs.renderer = null
      refs.composer = null
      refs.bloomPass = null
      refs.objects = []
      refs.stars = []
      refs.mountains = []
      refs.nebula = null
      refs.atmosphere = null
      refs.grid = null
      refs.animationId = null
      refs.scrollTrigger = null
    }
  }, [])

  useEffect(() => {
    const section = sectionRef.current

    if (!section) {
      return undefined
    }

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: {
          ease: 'power3.out',
        },
      })

      timeline
        .from(sideRef.current, { x: -28, opacity: 0, duration: 0.8 })
        .from(rolesRef.current?.children || [], { y: 18, opacity: 0, stagger: 0.08, duration: 0.65 }, '-=0.45')
        .from(titleRef.current, { y: 46, opacity: 0, duration: 1 }, '-=0.35')
        .from(subtitleRef.current, { y: 24, opacity: 0, duration: 0.75 }, '-=0.52')
        .from(chaptersRef.current?.querySelectorAll('[data-hero-chapter]') || [], {
          y: 18,
          opacity: 0,
          stagger: 0.12,
          duration: 0.72,
        }, '-=0.4')
        .from(ctaRef.current?.children || [], { y: 18, opacity: 0, stagger: 0.1, duration: 0.65 }, '-=0.42')
    }, section)

    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative isolate min-h-[calc(100vh-8rem)] overflow-hidden border border-line bg-ink shadow-panel sm:min-h-[calc(100vh-7rem)]"
      aria-labelledby="hero-title"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_18%,rgba(124,140,255,0.22),transparent_28%),linear-gradient(180deg,rgba(5,7,11,0.12),rgba(5,7,11,0.92))]" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-ink to-transparent" aria-hidden="true" />

      <div
        ref={sideRef}
        className="pointer-events-none absolute left-5 top-8 z-10 hidden items-center gap-4 text-xs uppercase tracking-[0.48em] text-muted sm:flex"
      >
        <span className="h-px w-12 bg-accent/50" />
        <span>BACKEND LAB</span>
      </div>

      <div className="relative z-10 flex min-h-[calc(100vh-8rem)] items-center px-5 py-20 sm:min-h-[calc(100vh-7rem)] sm:px-8 lg:px-12">
        <div className="grid w-full gap-10 lg:grid-cols-[1.05fr_0.55fr] lg:items-end">
          <div className="max-w-5xl">
            <div ref={rolesRef} className="flex flex-wrap gap-2">
              {roles.map((role) => (
                <span
                  key={role}
                  className="border border-line bg-panel/70 px-3 py-1 text-xs uppercase tracking-[0.22em] text-muted backdrop-blur"
                >
                  {role}
                </span>
              ))}
            </div>

            <h1
              id="hero-title"
              ref={titleRef}
              className="mt-7 text-[clamp(3.2rem,14vw,10rem)] font-semibold uppercase leading-none tracking-[0.04em] text-foreground"
            >
              PORTFOLIO
            </h1>

            <p ref={subtitleRef} className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              A digital space for backend systems, software engineering, and technical exploration.
            </p>

            <div ref={chaptersRef} className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-2">
              {chapters.map((chapter) => (
                <article
                  key={chapter.title}
                  data-hero-chapter
                  className="border border-line bg-panel/65 p-4 shadow-glow backdrop-blur"
                >
                  <p className="text-xs uppercase tracking-[0.32em] text-accent">{chapter.title}</p>
                  <p className="mt-3 text-sm leading-6 text-muted">{chapter.description}</p>
                </article>
              ))}
            </div>

            <div ref={ctaRef} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                className="inline-flex items-center justify-center border border-accent bg-accent-soft px-5 py-3 text-sm font-medium text-foreground shadow-glow transition-colors hover:bg-panelStrong"
                href="#projects"
              >
                View Projects
              </a>
              <a
                className="inline-flex items-center justify-center border border-line bg-ink/45 px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-accent hover:bg-panelStrong"
                href="#contact"
              >
                Contact Me
              </a>
            </div>
          </div>

          <aside className="hidden border border-line bg-panel/55 p-5 shadow-panel backdrop-blur lg:block">
            <div className="mb-5 flex items-center justify-between text-xs uppercase tracking-[0.22em] text-muted">
              <span>BACKEND LAB</span>
              <span>LIVE SYSTEM</span>
            </div>
            <div className="space-y-3">
              {['API Layer', 'Data Flow', 'Cloud Path', 'Security Boundary'].map((item, index) => (
                <div key={item} className="flex items-center gap-4 border border-line bg-ink/65 p-3">
                  <span className="flex h-8 w-8 items-center justify-center border border-accent/35 text-xs text-foreground">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{item}</p>
                    <p className="mt-1 text-xs text-muted">Portfolio signal layer</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>

      <div className="absolute bottom-6 left-5 right-5 z-10 flex items-center gap-4 text-xs uppercase tracking-[0.24em] text-muted sm:left-8 sm:right-8 lg:left-12 lg:right-12">
        <span>Scroll</span>
        <div className="h-px flex-1 overflow-hidden bg-line">
          <div
            ref={progressFillRef}
            className="h-full origin-left scale-x-[0.04] bg-accent transition-transform duration-150"
          />
        </div>
        <span>Explore</span>
      </div>
    </section>
  )
}
