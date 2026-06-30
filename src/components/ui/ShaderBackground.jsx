import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

const ShaderBackground = () => {
  const containerRef = useRef(null)
  const [shouldRender, setShouldRender] = useState(false)

  // Scroll listener to toggle WebGL rendering activity based on scroll offset
  useEffect(() => {
    const handleScroll = () => {
      // Start rendering slightly before Hero is scrolled away to allow WebGL initialization
      const scrolledPastHero = window.scrollY > window.innerHeight * 0.8
      setShouldRender(scrolledPastHero)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!shouldRender) return

    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    
    // WebGLRenderer with standard opaque context for full contrast
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    
    // Clamp pixel ratio to 1.1 to drastically reduce fragment shader costs on High-DPI screens
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.1))
    container.appendChild(renderer.domElement)

    const material = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
      },
      vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float iTime;
        uniform vec2 iResolution;

        #define NUM_OCTAVES 2

        float rand(vec2 n) {
          return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
        }

        float noise(vec2 p) {
          vec2 ip = floor(p);
          vec2 u = fract(p);
          u = u*u*(3.0-2.0*u);

          float res = mix(
            mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
            mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x), u.y);
          return res * res;
        }

        float fbm(vec2 x) {
          float v = 0.0;
          float a = 0.3;
          vec2 shift = vec2(100);
          mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
          for (int i = 0; i < NUM_OCTAVES; ++i) {
            v += a * noise(x);
            x = rot * x * 2.0 + shift;
            a *= 0.4;
          }
          return v;
        }

        void main() {
          vec2 shake = vec2(sin(iTime * 0.4) * 0.002, cos(iTime * 0.7) * 0.002);
          vec2 p = ((gl_FragCoord.xy + shake * iResolution.xy) - iResolution.xy * 0.5) / iResolution.y * mat2(6.0, -4.0, 4.0, 6.0);
          vec2 v;
          vec4 o = vec4(0.0);

          float f = 2.0 + fbm(p + vec2(iTime * 1.5, 0.0)) * 0.5;

          for (float i = 0.0; i < 18.0; i++) {
            v = p + cos(i * i + (iTime + p.x * 0.08) * 0.01 + i * vec2(13.0, 11.0)) * 3.5 + vec2(sin(iTime * 0.8 + i) * 0.001, cos(iTime * 1.0 - i) * 0.001);
            float tailNoise = fbm(v + vec2(iTime * 0.15, i)) * 0.3 * (1.0 - (i / 18.0));
            
            // Refined Color Palette: Sky Blue, Soft Cyan, and Soft Purple (keeps green neon very low)
            vec4 auroraColors = vec4(
              0.22 + 0.22 * sin(i * 0.15 + iTime * 0.15),
              0.10 + 0.12 * cos(i * 0.20 + iTime * 0.20),
              0.60 + 0.30 * sin(i * 0.30 + iTime * 0.12),
              1.0
            );
            vec4 currentContribution = auroraColors * exp(sin(i * i + iTime * 0.25)) / length(max(v, vec2(v.x * f * 0.015, v.y * 1.5)));
            float thinnessFactor = smoothstep(0.0, 1.0, i / 18.0) * 0.6;
            o += currentContribution * (1.0 + tailNoise * 0.8) * thinnessFactor;
          }

          // Softer environmental glow mapping (adjusted for fewer loops)
          o = tanh(pow(o / 75.0, vec4(1.6)));

          // Add a tiny amount of film grain noise to break up gradients and add cinematic texture
          float grain = (rand(gl_FragCoord.xy * 0.01 + iTime) - 0.5) * 0.014;

          gl_FragColor = vec4(o.rgb * 0.65 + vec3(grain), 1.0);
        }
      `
    })

    const geometry = new THREE.PlaneGeometry(2, 2)
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    let frameId
    let lastTime = 0
    let isPageVisible = true

    const animate = (time) => {
      frameId = requestAnimationFrame(animate)

      // Throttle rendering loop to 30 FPS
      if (time - lastTime < 33.3) return
      lastTime = time

      if (!isPageVisible) return

      material.uniforms.iTime.value += 0.003 // Extremely slow, environmental movement
      renderer.render(scene, camera)
    }

    // Start render loop
    lastTime = performance.now()
    frameId = requestAnimationFrame(animate)

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight)
      material.uniforms.iResolution.value.set(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    const handleVisibility = () => {
      isPageVisible = !document.hidden
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibility)
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [shouldRender])

  // Fade-in transition when shouldRender is true (scrolled past Hero)
  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 -z-30 w-screen h-screen overflow-hidden pointer-events-none bg-[#020204] transition-opacity duration-1000"
      style={{ opacity: shouldRender ? 0.75 : 0 }} // quieter environmental lighting opacity
    />
  )
}

export default ShaderBackground
