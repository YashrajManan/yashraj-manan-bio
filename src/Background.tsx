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

interface FloatingGraph {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  kind: 'bar' | 'line' | 'scatter' | 'wave' | 'dna' | 'rna' | 'protein' | 'molecule'
  colorKey: 'neutral' | 'a' | 'b'
  alpha: number
  phase: number
  data: number[]
}

const GRAPH_KINDS: FloatingGraph['kind'][] = [
  'bar',
  'line',
  'scatter',
  'wave',
  'dna',
  'rna',
  'protein',
  'molecule',
]

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

const PROTEIN_NET = ['STRING db', 'Cytoscape', 'PPI network', 'ADMET']

const BIO_AI = [
  'ESM-2',
  'AlphaFold2',
  'ProtBERT',
  'DNABERT',
  'Evo (genomic LLM)',
  'ProGen2',
  'Transformer',
  'BERT',
  'GPT',
  'CNN',
  'LSTM',
  'gradient descent',
  'fine-tuning',
  'attention head',
  'embedding space',
]

const DNA_RNA = [
  'ATCG',
  'AUGC',
  "5'-ATG-3'",
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
      ...BIO_AI.map((text) => ({ text, colorKey: 'a' as const })),
    ]

    const labels: FloatingLabel[] = labelPool.map(({ text, colorKey }) => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00035,
      vy: (Math.random() - 0.5) * 0.00035,
      size: 12 + Math.random() * 5,
      text,
      colorKey,
      alpha: 0.18 + Math.random() * 0.14,
      phase: Math.random() * Math.PI * 2,
    }))

    const graphColorKeys: FloatingGraph['colorKey'][] = ['neutral', 'a', 'b']
    const graphs: FloatingGraph[] = Array.from({ length: 22 }, (_, i) => {
      const kind = GRAPH_KINDS[i % GRAPH_KINDS.length]
      const pointCount = kind === 'bar' ? 5 : kind === 'scatter' ? 9 : 7
      return {
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.0003,
        vy: (Math.random() - 0.5) * 0.0003,
        size: 46 + Math.random() * 22,
        kind,
        colorKey: graphColorKeys[i % graphColorKeys.length],
        alpha: 0.16 + Math.random() * 0.12,
        phase: Math.random() * Math.PI * 2,
        data: Array.from({ length: pointCount }, () => Math.random()),
      }
    })

    function drawGraph(g: FloatingGraph, color: string) {
      if (!ctx) return
      const cx = g.x * width
      const cy = g.y * height
      const s = g.size
      ctx.save()
      ctx.translate(cx, cy)
      ctx.strokeStyle = `rgba(${color}, ${g.alpha})`
      ctx.fillStyle = `rgba(${color}, ${g.alpha})`
      ctx.lineWidth = 1.2

      if (g.kind === 'bar') {
        const bw = s / (g.data.length * 1.6)
        g.data.forEach((v, i) => {
          const bh = v * s * 0.8
          ctx.fillRect(i * bw * 1.6 - s / 2, s / 2 - bh, bw, bh)
        })
        ctx.strokeRect(-s / 2, -s / 2, s, s)
      } else if (g.kind === 'line') {
        ctx.beginPath()
        g.data.forEach((v, i) => {
          const px = (i / (g.data.length - 1)) * s - s / 2
          const py = s / 2 - v * s
          if (i === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        })
        ctx.stroke()
      } else if (g.kind === 'scatter') {
        for (let i = 0; i < g.data.length; i += 2) {
          const px = g.data[i] * s - s / 2
          const py = (g.data[(i + 1) % g.data.length] * s - s / 2) * -1
          ctx.beginPath()
          ctx.arc(px, py, 1.6, 0, Math.PI * 2)
          ctx.fill()
        }
      } else if (g.kind === 'wave') {
        ctx.beginPath()
        for (let px = -s / 2; px <= s / 2; px += 3) {
          const py = Math.sin(px * 0.25 + t * 2 + g.phase) * (s * 0.22)
          if (px === -s / 2) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        }
        ctx.stroke()
      } else if (g.kind === 'dna') {
        const amp = s * 0.18
        const h = s
        for (const dir of [1, -1]) {
          ctx.beginPath()
          for (let y = -h / 2; y <= h / 2; y += 4) {
            const x = Math.sin((y + t * 40 + g.phase * 20) * 0.25) * amp * dir
            if (y === -h / 2) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          }
          ctx.stroke()
        }
        for (let y = -h / 2; y <= h / 2; y += 10) {
          const x1 = Math.sin((y + t * 40 + g.phase * 20) * 0.25) * amp
          ctx.beginPath()
          ctx.moveTo(x1, y)
          ctx.lineTo(-x1, y)
          ctx.stroke()
        }
      } else if (g.kind === 'rna') {
        const amp = s * 0.22
        const h = s
        ctx.beginPath()
        for (let y = -h / 2; y <= h / 2; y += 3) {
          const x = Math.sin((y + t * 50 + g.phase * 20) * 0.3) * amp
          if (y === -h / 2) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
        for (let y = -h / 2; y <= h / 2; y += 9) {
          const x = Math.sin((y + t * 50 + g.phase * 20) * 0.3) * amp
          ctx.beginPath()
          ctx.arc(x, y, 1.4, 0, Math.PI * 2)
          ctx.fill()
        }
      } else if (g.kind === 'protein') {
        const turns = 4
        const amp = s * 0.28
        const h = s
        ctx.lineWidth = 1.8
        ctx.beginPath()
        for (let i = 0; i <= 60; i++) {
          const p = i / 60
          const y = -h / 2 + p * h
          const x = Math.sin(p * Math.PI * 2 * turns + g.phase) * amp
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
      } else {
        const r = s * 0.28
        const sides = 6
        ctx.beginPath()
        for (let i = 0; i <= sides; i++) {
          const ang = (Math.PI * 2 * i) / sides - Math.PI / 2
          const x = Math.cos(ang) * r
          const y = Math.sin(ang) * r
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
        for (const ang of [-Math.PI / 2, Math.PI / 2]) {
          const x0 = Math.cos(ang) * r
          const y0 = Math.sin(ang) * r
          const x1 = Math.cos(ang) * (r + s * 0.2)
          const y1 = Math.sin(ang) * (r + s * 0.2)
          ctx.beginPath()
          ctx.moveTo(x0, y0)
          ctx.lineTo(x1, y1)
          ctx.stroke()
          ctx.beginPath()
          ctx.arc(x1, y1, 1.8, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      ctx.restore()
    }

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
          ctx.strokeStyle = `rgba(${strandA}, ${0.03 + depth * 0.03})`
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
        ctx.strokeStyle = `rgba(${s === 0 ? strandA : strandB}, 0.13)`
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
      ambient.addColorStop(0, `rgba(${glowColor}, 0.06)`)
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

      for (const g of graphs) {
        if (!reduceMotion) {
          g.x += g.vx
          g.y += g.vy
          if (g.x < -0.05 || g.x > 1.05) g.vx *= -1
          if (g.y < -0.05 || g.y > 1.05) g.vy *= -1
        }
        const color = g.colorKey === 'a' ? strandA : g.colorKey === 'b' ? strandB : dotColor
        drawGraph(g, color)
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
            const alpha = (1 - dist / LINK_DIST) * (a.hub || b.hub ? 0.38 : 0.24)
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
          const alpha = (1 - mdist / MOUSE_DIST) * 0.5
          ctx.strokeStyle = `rgba(${strandB}, ${alpha})`
          ctx.lineWidth = 1.4
          ctx.beginPath()
          ctx.moveTo(ax, ay)
          ctx.lineTo(mx, my)
          ctx.stroke()
        }

        if (a.hub) {
          ctx.shadowColor = `rgba(${glowColor}, 0.6)`
          ctx.shadowBlur = 7
        }
        ctx.fillStyle = a.hub ? `rgba(${glowColor}, 0.6)` : `rgba(${dotColor}, 0.32)`
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
