<script setup lang="ts">
import * as THREE from 'three'

const host = ref<HTMLDivElement>()
const ready = ref(false)
const paused = ref(false)
let cleanup = () => {}
let updatePlayback = () => {}
watch(paused, () => updatePlayback())

onMounted(() => {
  const element = host.value
  if (!element) return
  let renderer: THREE.WebGLRenderer
  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'low-power',
    })
  } catch {
    return
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
  element.appendChild(renderer.domElement)
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100)
  camera.position.z = 8.4
  const group = new THREE.Group()
  scene.add(group)
  const geometry = new THREE.SphereGeometry(1, 32, 24)
  const material = new THREE.MeshStandardMaterial({
    color: '#c7f875',
    roughness: 0.8,
  })
  const skin = new THREE.MeshStandardMaterial({ color: '#f2bd96', roughness: 0.85 })
  const hair = new THREE.MeshStandardMaterial({ color: '#30251f', roughness: 0.85 })
  const pants = new THREE.MeshStandardMaterial({ color: '#33434b', roughness: 0.9 })
  const white = new THREE.MeshStandardMaterial({ color: '#fff9ee', roughness: 0.8 })
  const blush = new THREE.MeshStandardMaterial({ color: '#e89a85', roughness: 0.9 })
  const ball = (parent: THREE.Group, finish: THREE.Material,
    position: [number, number, number], scale: [number, number, number]) => {
    const mesh = new THREE.Mesh(geometry, finish)
    mesh.position.set(...position)
    mesh.scale.set(...scale)
    parent.add(mesh)
    return mesh
  }
  ball(group, material, [0, -0.35, 0], [0.55, 0.65, 0.36])
  ball(group, skin, [0, 0.26, 0], [0.22, 0.27, 0.22])
  for (const side of [-1, 1]) {
    ball(group, pants, [side * 0.25, -1.02, 0], [0.23, 0.45, 0.25])
    ball(group, white, [side * 0.26, -1.38, 0.13], [0.26, 0.17, 0.39])
    ball(group, skin, [side * 0.72, 0.87, 0], [0.16, 0.23, 0.15])
  }
  ball(group, skin, [0, 0.94, 0.02], [0.73, 0.78, 0.62])
  ball(group, hair, [0, 1.36, -0.1], [0.75, 0.47, 0.57])
  for (let i = 0; i < 5; i++) {
    const lock = ball(group, hair, [-0.49 + i * 0.23, 1.48 - i * 0.065, 0.37], [0.25, 0.29, 0.25])
    lock.rotation.z = -0.45
  }
  for (const side of [-1, 1]) {
    ball(group, hair, [side * 0.25, 0.99, 0.595], [0.062, 0.092, 0.032])
    ball(group, white, [side * 0.25 - 0.015, 1.02, 0.622], [0.019, 0.025, 0.012])
    ball(group, blush, [side * 0.43, 0.79, 0.52], [0.12, 0.055, 0.026])
    ball(group, hair, [side * 0.25, 1.16, 0.58], [0.105, 0.025, 0.027])
  }
  ball(group, skin, [0, 0.84, 0.64], [0.105, 0.12, 0.11])
  const smileGeometry = new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(-0.15, 0.67, 0.577),
    new THREE.Vector3(0, 0.53, 0.64),
    new THREE.Vector3(0.15, 0.67, 0.577),
  ), 20, 0.018, 8, false)
  group.add(new THREE.Mesh(smileGeometry, hair))
  const restingArm = new THREE.Group()
  restingArm.position.set(-0.46, -0.13, 0)
  restingArm.rotation.z = -0.22
  group.add(restingArm)
  ball(restingArm, material, [0, -0.22, 0], [0.19, 0.35, 0.21])
  ball(restingArm, skin, [0, -0.55, 0.02], [0.17, 0.19, 0.17])
  const wavingArm = new THREE.Group()
  wavingArm.position.set(0.47, -0.1, 0)
  wavingArm.rotation.z = -0.65
  group.add(wavingArm)
  ball(wavingArm, material, [0, 0.25, 0], [0.19, 0.34, 0.21])
  ball(wavingArm, skin, [0, 0.61, 0], [0.17, 0.22, 0.13])
  ball(wavingArm, skin, [-0.15, 0.56, 0.03], [0.09, 0.12, 0.09])
  group.rotation.y = -0.12
  scene.add(new THREE.HemisphereLight(0xf5ffe9, 0x263918, 3))
  const key = new THREE.DirectionalLight(0xffffff, 5)
  key.position.set(-3, 4, 5)
  scene.add(key)
  const rim = new THREE.DirectionalLight(0xb3ff5e, 4)
  rim.position.set(4, -2, -2)
  scene.add(rim)
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
  let visible = true
  let lost = false
  let previous = 0
  let elapsed = 0
  let pointerX = 0
  let pointerY = 0
  const render = () => renderer.render(scene, camera)
  const animate = (time: number) => {
    elapsed += previous ? Math.min((time - previous) / 1000, 0.05) : 0
    previous = time
    wavingArm.rotation.z = -0.65 + Math.sin(elapsed * 2.8) * 0.16
    group.rotation.y += (pointerX * 0.25 - 0.12 - group.rotation.y) * 0.04
    group.rotation.x += (pointerY * 0.16 - group.rotation.x) * 0.04
    group.position.y = Math.sin(elapsed * 0.7) * 0.08
    render()
  }
  updatePlayback = () => {
    previous = 0
    renderer.setAnimationLoop(
      !paused.value && !motion.matches && visible && !document.hidden && !lost
        ? animate
        : null,
    )
    if (!lost) render()
  }
  const resize = () => {
    const { width, height } = element.getBoundingClientRect()
    if (!width || !height) return
    renderer.setSize(width, height)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    if (!lost) render()
  }
  const move = (event: PointerEvent) => {
    const rect = element.getBoundingClientRect()
    pointerX = ((event.clientX - rect.left) / rect.width) * 2 - 1
    pointerY = ((event.clientY - rect.top) / rect.height) * 2 - 1
  }
  const leave = () => {
    pointerX = 0
    pointerY = 0
  }
  const contextLost = (event: Event) => {
    event.preventDefault()
    lost = true
    ready.value = false
    updatePlayback()
  }
  const contextRestored = () => {
    lost = false
    ready.value = true
    resize()
    updatePlayback()
  }
  const observer = new ResizeObserver(resize)
  observer.observe(element)
  const intersection = new IntersectionObserver(([entry]) => {
    visible = !!entry?.isIntersecting
    updatePlayback()
  })
  intersection.observe(element)
  element.addEventListener('pointermove', move)
  element.addEventListener('pointerleave', leave)
  renderer.domElement.addEventListener('webglcontextlost', contextLost)
  renderer.domElement.addEventListener('webglcontextrestored', contextRestored)
  document.addEventListener('visibilitychange', updatePlayback)
  motion.addEventListener('change', updatePlayback)
  resize()
  ready.value = true
  updatePlayback()
  cleanup = () => {
    renderer.setAnimationLoop(null)
    observer.disconnect()
    intersection.disconnect()
    element.removeEventListener('pointermove', move)
    element.removeEventListener('pointerleave', leave)
    renderer.domElement.removeEventListener('webglcontextlost', contextLost)
    renderer.domElement.removeEventListener(
      'webglcontextrestored',
      contextRestored,
    )
    document.removeEventListener('visibilitychange', updatePlayback)
    motion.removeEventListener('change', updatePlayback)
    geometry.dispose()
    material.dispose()
    smileGeometry.dispose()
    ;[skin, hair, pants, white, blush].forEach((finish) => finish.dispose())
    renderer.dispose()
    renderer.domElement.remove()
  }
})
onBeforeUnmount(() => cleanup())
</script>

<template>
  <div class="sculpture-wrap">
    <div ref="host" class="sculpture-canvas" aria-hidden="true" />
    <div v-if="!ready" class="sculpture-fallback" aria-hidden="true" />
    <button
      v-if="ready"
      class="motion-toggle"
      :aria-pressed="paused"
      :aria-label="paused ? 'Play 3D animation' : 'Pause 3D animation'"
      @click="paused = !paused"
    >
      {{ paused ? '▶ PLAY' : 'Ⅱ PAUSE' }}
    </button>
  </div>
</template>
