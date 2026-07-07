import { useEffect, useRef } from 'react'

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  hub: boolean
}

interface FloatingLabel {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  text: string
  colorKey: 'neutral' | 'a' | 'b'
  alpha: number
  phase: number
}

const NODE_COUNT = 90
const LINK_DIST = 150
const MOUSE_DIST = 190
const HELIX_STRANDS = 3

const CODE_ALGO = [
  'for i in range(n):',
  'while queue:',
  'return dp[i-1]+dp[i-2]',
  'O(n log n)',
  'if visited[u]: continue',
  'def bfs(graph):',
  'class Node:',
  '01001010',
  'λx. x + 1',
  'quicksort(arr)',
  'y = softmax(z)',
]

const PROTEIN_NET = [
  'STRING db',
  'Cytoscape',
  'PPI network',
  'ESM2 embedding',
  'AlphaFold',
  'Gag protein',
  'POL gene',
  'LDHA',
  'ADMET',
]

const DNA_RNA = [
  'ATCG',
  'AUGC',
  "5'-ATG-3'",
  'GAG-POL',
  'dsDNA',
  'mRNA',
  'tRNA',
  'Watson–Crick',
]

const MATH_STATS = [
  'P(A|B)',
  'μ ± σ',
  'R² = 0.94',
  '∫ f(x) dx',
  'χ²',
  'ANOVA',
  '∇L(θ)',
  'argmax',
  'Σ xᵢ',
]

function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = 0
    let height = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const mouse = { x: -9999, y: -9999 }

    const nodes: Node[] = Array.from({ length: NODE_COUNT }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00055,
      vy: (Math.random() - 0.5) * 0.00055,
      r: i % 11 === 0 ? 3.2 : 1.6,
      hub: i % 11 === 0,
    }))

    const labelPool: { text: string; colorKey: FloatingLabel['colorKey'] }[] = [
      ...CODE_ALGO.map((text) => ({ text, colorKey: 'neutral' as const })),
      ...MATH_STATS.map((text) => ({ text, colorKey: 'neutral' as const })),
      ...PROTEIN_NET.map((text) => ({ text, colorKey: 'a' as const })),
      ...DNA_RNA.map((text) => ({ text, colorKey: 'b' as const })),
    ]

    const labels: FloatingLabel[] = labelPool.map(({ text, colorKey }) => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00035,
      vy: (Math.random() - 0.5) * 0.00035,
      size: 12 + Math.random() * 5,
      text,
      colorKey,
      alpha: 0.14 + Math.random() * 0.12,
      phase: Math.random() * Math.PI * 2,
    }))

    function resize() {
      if (!canvas) return
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function onMouseMove(e: MouseEvent) {
      mouse.x = e.clientX / width
      mouse.y = e.clientY / height
    }

    function onMouseLeave() {
      mouse.x = -9999
      mouse.y = -9999
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseleave', onMouseLeave)

    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const strandA = isDark ? '192, 132, 252' : '170, 59, 255'
    const strandB = isDark ? '96, 200, 246' : '43, 140, 212'
    const dotColor = isDark ? '243, 244, 246' : '8, 6, 13'
    const rgbA = strandA.split(',').map(Number)
    const rgbB = strandB.split(',').map(Number)

    function mixColor(mix: number) {
      const r = Math.round(rgbA[0] + (rgbB[0] - rgbA[0]) * mix)
      const g = Math.round(rgbA[1] + (rgbB[1] - rgbA[1]) * mix)
      const b = Math.round(rgbA[2] + (rgbB[2] - rgbA[2]) * mix)
      return `${r}, ${g}, ${b}`
    }

    let raf = 0
    let t = 0

    function drawHelix(cx: number, phase: number) {
      if (!ctx) return
      const amp = Math.min(70, width * 0.05)
      const step = 26
      const rungEvery = 2
      const points: { x: number; y: number; s: number }[] = []

      for (let y = -40, i = 0; y < height + 40; y += step, i++) {
        const wave = Math.sin(y * 0.012 + phase)
        const x1 = cx + wave * amp
        const x2 = cx - wave * amp
        const depth = (wave + 1) / 2

        if (i % rungEvery === 0) {
          ctx.strokeStyle = `rgba(${strandA}, ${0.05 + depth * 0.05})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(x1, y)
          ctx.lineTo(x2, y)
          ctx.stroke()
        }

        points.push({ x: x1, y, s: 0 })
        points.push({ x: x2, y, s: 1 })
      }

      for (const s of [0, 1]) {
        ctx.strokeStyle = `rgba(${s === 0 ? strandA : strandB}, 0.22)`
        ctx.lineWidth = 1.6
        ctx.beginPath()
        const strandPts = points.filter((p) => p.s === s)
        strandPts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)))
        ctx.stroke()
      }
    }

    function step() {
      if (!ctx) return
      ctx.clearRect(0, 0, width, height)

      if (!reduceMotion) t += 0.0035

      const glowMix = (Math.sin(t * 0.6) + 1) / 2
      const glowColor = mixColor(glowMix)
      const gx = mouse.x >= 0 && mouse.x <= 1 ? mouse.x * width : width * 0.5
      const gy = mouse.y >= 0 && mouse.y <= 1 ? mouse.y * height : height * 0.32
      const ambient = ctx.createRadialGradient(gx, gy, 0, gx, gy, Math.max(width, height) * 0.55)
      ambient.addColorStop(0, `rgba(${glowColor}, 0.1)`)
      ambient.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = ambient
      ctx.fillRect(0, 0, width, height)

      ctx.font = '13px ui-monospace, Consolas, monospace'
      ctx.textBaseline = 'middle'
      for (const l of labels) {
        if (!reduceMotion) {
          l.x += l.vx
          l.y += l.vy
          if (l.x < -0.05 || l.x > 1.05) l.vx *= -1
          if (l.y < -0.05 || l.y > 1.05) l.vy *= -1
        }
        const bob = reduceMotion ? 0 : Math.sin(t * 3 + l.phase) * 6
        const color = l.colorKey === 'a' ? strandA : l.colorKey === 'b' ? strandB : dotColor
        ctx.font = `${l.size}px ui-monospace, Consolas, monospace`
        ctx.fillStyle = `rgba(${color}, ${l.alpha})`
        ctx.fillText(l.text, l.x * width, l.y * height + bob)
      }

      for (let h = 0; h < HELIX_STRANDS; h++) {
        const cx = width * ((h + 0.5) / HELIX_STRANDS)
        drawHelix(cx, t * 2 + h * 2.1)
      }

      for (const n of nodes) {
        if (!reduceMotion) {
          n.x += n.vx
          n.y += n.vy
          if (n.x < 0 || n.x > 1) n.vx *= -1
          if (n.y < 0 || n.y > 1) n.vy *= -1
          n.x = Math.min(1, Math.max(0, n.x))
          n.y = Math.min(1, Math.max(0, n.y))
        }

        const px = n.x * width
        const py = n.y * height
        const mx = mouse.x * width
        const my = mouse.y * height
        const dx = px - mx
        const dy = py - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < MOUSE_DIST) {
          const force = (1 - dist / MOUSE_DIST) * 0.02
          n.x += (dx / (dist || 1)) * force * 0.012
          n.y += (dy / (dist || 1)) * force * 0.012
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        const ax = a.x * width
        const ay = a.y * height

        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const bx = b.x * width
          const by = b.y * height
          const dx = ax - bx
          const dy = ay - by
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < LINK_DIST) {
            const alpha = (1 - dist / LINK_DIST) * (a.hub || b.hub ? 0.6 : 0.4)
            ctx.strokeStyle = `rgba(${strandA}, ${alpha})`
            ctx.lineWidth = a.hub || b.hub ? 1.3 : 1
            ctx.beginPath()
            ctx.moveTo(ax, ay)
            ctx.lineTo(bx, by)
            ctx.stroke()
          }
        }

        const mx = mouse.x * width
        const my = mouse.y * height
        const mdx = ax - mx
        const mdy = ay - my
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy)
        if (mdist < MOUSE_DIST) {
          const alpha = (1 - mdist / MOUSE_DIST) * 0.8
          ctx.strokeStyle = `rgba(${strandB}, ${alpha})`
          ctx.lineWidth = 1.4
          ctx.beginPath()
          ctx.moveTo(ax, ay)
          ctx.lineTo(mx, my)
          ctx.stroke()
        }

        if (a.hub) {
          ctx.shadowColor = `rgba(${glowColor}, 0.9)`
          ctx.shadowBlur = 9
        }
        ctx.fillStyle = a.hub ? `rgba(${glowColor}, 0.9)` : `rgba(${dotColor}, 0.5)`
        ctx.beginPath()
        ctx.arc(ax, ay, a.r, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      }

      raf = requestAnimationFrame(step)
    }

    raf = requestAnimationFrame(step)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return <canvas ref={canvasRef} className="bg-network" aria-hidden="true" />
}

export default Background
