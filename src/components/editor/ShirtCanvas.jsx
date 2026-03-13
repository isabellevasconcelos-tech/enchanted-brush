import { useRef, useEffect, useCallback } from 'react'
import { Canvas } from 'fabric'

// ── Realistic T-Shirt SVG Generator ──────────────────────────────────

function generateShirtSVG(color, view = 'front') {
  const isFront = view === 'front'

  // Convert hex to RGB for SVG color manipulation
  const r = parseInt(color.slice(1, 3), 16)
  const g = parseInt(color.slice(3, 5), 16)
  const b = parseInt(color.slice(5, 7), 16)

  // Calculate luminance to adjust shadow/highlight intensity
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  const shadowOpacity = luminance > 0.5 ? 0.18 : 0.25
  const highlightOpacity = luminance > 0.5 ? 0.12 : 0.2

  // Neckline path differs for front vs back
  const neckPath = isFront
    ? 'M215,58 C215,58 225,82 250,85 C275,82 285,58 285,58'
    : 'M215,58 C215,58 228,68 250,70 C272,68 285,58 285,58'

  // Main body path (realistic proportions)
  const bodyPath = `
    M250,${isFront ? 85 : 70}
    ${neckPath.split('M')[1]?.includes('85') ? '' : ''}
    M160,52
    L120,58 L60,100 L28,175
    L65,195 L90,190 L100,185
    L95,370 L100,470 L110,530
    L180,540 L250,542 L320,540 L390,530
    L400,470 L405,370 L400,185
    L410,190 L435,195 L472,175
    L440,100 L380,58 L340,52
    ${isFront ? 'C330,55 305,58 285,58' : 'C330,55 305,58 285,58'}
    ${neckPath}
    ${isFront ? 'C215,58 195,55 160,52' : 'C215,58 195,55 160,52'}
    Z
  `

  // Left sleeve path
  const leftSleeve = `
    M160,52 L120,58 L60,100 L28,175 L65,195 L90,190 L100,185 L105,130 L130,80 L160,52 Z
  `

  // Right sleeve path
  const rightSleeve = `
    M340,52 L380,58 L440,100 L472,175 L435,195 L410,190 L400,185 L395,130 L370,80 L340,52 Z
  `

  // Collar path
  const collarOuter = isFront
    ? 'M160,52 C195,55 215,58 215,58 C215,58 225,82 250,85 C275,82 285,58 285,58 C285,58 305,55 340,52 C330,42 300,32 250,30 C200,32 170,42 160,52 Z'
    : 'M160,52 C195,55 215,58 215,58 C215,58 228,68 250,70 C272,68 285,58 285,58 C285,58 305,55 340,52 C330,42 300,32 250,30 C200,32 170,42 160,52 Z'

  const collarInner = isFront
    ? 'M175,50 C200,52 220,55 220,55 C220,55 230,76 250,79 C270,76 280,55 280,55 C280,55 300,52 325,50 C315,42 290,35 250,33 C210,35 185,42 175,50 Z'
    : 'M175,50 C200,52 220,55 220,55 C220,55 232,64 250,66 C268,64 280,55 280,55 C280,55 300,52 325,50 C315,42 290,35 250,33 C210,35 185,42 175,50 Z'

  // Fold lines for realism
  const foldLines = isFront ? `
    <path d="M200,150 C210,250 195,380 205,500" stroke="rgba(0,0,0,${shadowOpacity * 0.3})" stroke-width="1.5" fill="none" opacity="0.4"/>
    <path d="M300,150 C290,250 305,380 295,500" stroke="rgba(0,0,0,${shadowOpacity * 0.3})" stroke-width="1.5" fill="none" opacity="0.4"/>
    <path d="M230,200 C235,300 228,400 232,520" stroke="rgba(0,0,0,${shadowOpacity * 0.2})" stroke-width="0.8" fill="none" opacity="0.3"/>
    <path d="M270,200 C265,300 272,400 268,520" stroke="rgba(0,0,0,${shadowOpacity * 0.2})" stroke-width="0.8" fill="none" opacity="0.3"/>
  ` : `
    <path d="M195,130 C205,250 190,380 200,500" stroke="rgba(0,0,0,${shadowOpacity * 0.3})" stroke-width="1.5" fill="none" opacity="0.4"/>
    <path d="M305,130 C295,250 310,380 300,500" stroke="rgba(0,0,0,${shadowOpacity * 0.3})" stroke-width="1.5" fill="none" opacity="0.4"/>
    <path d="M250,100 C248,250 252,400 250,530" stroke="rgba(0,0,0,${shadowOpacity * 0.15})" stroke-width="0.6" fill="none" opacity="0.25"/>
  `

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 580" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <defs>
        <!-- Fabric texture filter -->
        <filter id="fabricTexture" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" result="noise"/>
          <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise"/>
          <feComponentTransfer in="grayNoise" result="softNoise">
            <feFuncA type="linear" slope="0.06"/>
          </feComponentTransfer>
          <feComposite in="softNoise" in2="SourceGraphic" operator="in" result="texturedNoise"/>
          <feMerge>
            <feMergeNode in="SourceGraphic"/>
            <feMergeNode in="texturedNoise"/>
          </feMerge>
        </filter>

        <!-- Soft shadow filter -->
        <filter id="softShadow" x="-5%" y="-5%" width="110%" height="110%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="8" result="blur"/>
          <feOffset dx="3" dy="6" result="offsetBlur"/>
          <feComponentTransfer in="offsetBlur" result="shadow">
            <feFuncA type="linear" slope="0.3"/>
          </feComponentTransfer>
          <feMerge>
            <feMergeNode in="shadow"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        <!-- Body shape clip -->
        <clipPath id="shirtClip">
          <path d="${bodyPath}"/>
        </clipPath>

        <!-- Print area clip (chest region) -->
        <clipPath id="printClip">
          <rect x="145" y="120" width="210" height="300" rx="8"/>
        </clipPath>

        <!-- 3D body shading gradient (left-right) -->
        <linearGradient id="bodyShade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="black" stop-opacity="${shadowOpacity * 0.6}"/>
          <stop offset="15%" stop-color="black" stop-opacity="${shadowOpacity * 0.15}"/>
          <stop offset="40%" stop-color="white" stop-opacity="${highlightOpacity * 0.3}"/>
          <stop offset="55%" stop-color="white" stop-opacity="${highlightOpacity * 0.15}"/>
          <stop offset="85%" stop-color="black" stop-opacity="${shadowOpacity * 0.15}"/>
          <stop offset="100%" stop-color="black" stop-opacity="${shadowOpacity * 0.6}"/>
        </linearGradient>

        <!-- Vertical body shading (top-bottom) -->
        <linearGradient id="bodyShadeV" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="black" stop-opacity="${shadowOpacity * 0.1}"/>
          <stop offset="20%" stop-color="white" stop-opacity="${highlightOpacity * 0.1}"/>
          <stop offset="60%" stop-color="black" stop-opacity="0"/>
          <stop offset="90%" stop-color="black" stop-opacity="${shadowOpacity * 0.12}"/>
          <stop offset="100%" stop-color="black" stop-opacity="${shadowOpacity * 0.2}"/>
        </linearGradient>

        <!-- Left sleeve shading -->
        <linearGradient id="sleeveShadeL" x1="0" y1="0" x2="1" y2="0.5">
          <stop offset="0%" stop-color="black" stop-opacity="${shadowOpacity * 0.5}"/>
          <stop offset="30%" stop-color="black" stop-opacity="${shadowOpacity * 0.1}"/>
          <stop offset="60%" stop-color="white" stop-opacity="${highlightOpacity * 0.15}"/>
          <stop offset="100%" stop-color="black" stop-opacity="${shadowOpacity * 0.3}"/>
        </linearGradient>

        <!-- Right sleeve shading -->
        <linearGradient id="sleeveShadeR" x1="1" y1="0" x2="0" y2="0.5">
          <stop offset="0%" stop-color="black" stop-opacity="${shadowOpacity * 0.5}"/>
          <stop offset="30%" stop-color="black" stop-opacity="${shadowOpacity * 0.1}"/>
          <stop offset="60%" stop-color="white" stop-opacity="${highlightOpacity * 0.15}"/>
          <stop offset="100%" stop-color="black" stop-opacity="${shadowOpacity * 0.3}"/>
        </linearGradient>

        <!-- Collar gradient -->
        <linearGradient id="collarGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="black" stop-opacity="${shadowOpacity * 0.3}"/>
          <stop offset="40%" stop-color="black" stop-opacity="${shadowOpacity * 0.05}"/>
          <stop offset="70%" stop-color="white" stop-opacity="${highlightOpacity * 0.1}"/>
          <stop offset="100%" stop-color="black" stop-opacity="${shadowOpacity * 0.15}"/>
        </linearGradient>

        <!-- Under-collar shadow -->
        <radialGradient id="neckShadow" cx="0.5" cy="0" r="0.6">
          <stop offset="0%" stop-color="black" stop-opacity="${shadowOpacity * 0.6}"/>
          <stop offset="100%" stop-color="black" stop-opacity="0"/>
        </radialGradient>

        <!-- Chest highlight -->
        <radialGradient id="chestHighlight" cx="0.5" cy="0.25" r="0.4" fx="0.5" fy="0.2">
          <stop offset="0%" stop-color="white" stop-opacity="${highlightOpacity * 0.25}"/>
          <stop offset="100%" stop-color="white" stop-opacity="0"/>
        </radialGradient>

        <!-- Armhole shadow left -->
        <radialGradient id="armShadowL" cx="0.8" cy="0.3" r="0.5">
          <stop offset="0%" stop-color="black" stop-opacity="${shadowOpacity * 0.5}"/>
          <stop offset="100%" stop-color="black" stop-opacity="0"/>
        </radialGradient>

        <!-- Armhole shadow right -->
        <radialGradient id="armShadowR" cx="0.2" cy="0.3" r="0.5">
          <stop offset="0%" stop-color="black" stop-opacity="${shadowOpacity * 0.5}"/>
          <stop offset="100%" stop-color="black" stop-opacity="0"/>
        </radialGradient>

        <!-- Hem shadow -->
        <linearGradient id="hemShadow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="black" stop-opacity="0"/>
          <stop offset="70%" stop-color="black" stop-opacity="${shadowOpacity * 0.1}"/>
          <stop offset="100%" stop-color="black" stop-opacity="${shadowOpacity * 0.35}"/>
        </linearGradient>
      </defs>

      <!-- ═══ Drop shadow ═══ -->
      <g filter="url(#softShadow)">

        <!-- ═══ Base shirt color (clipped) ═══ -->
        <g clip-path="url(#shirtClip)" filter="url(#fabricTexture)">
          <path d="${bodyPath}" fill="${color}"/>

          <!-- 3D shading: side shadows & center highlight -->
          <path d="${bodyPath}" fill="url(#bodyShade)"/>

          <!-- Vertical shading -->
          <path d="${bodyPath}" fill="url(#bodyShadeV)"/>

          <!-- Chest highlight -->
          <rect x="130" y="80" width="240" height="280" fill="url(#chestHighlight)" clip-path="url(#shirtClip)"/>

          <!-- Under-collar shadow area -->
          <ellipse cx="250" cy="${isFront ? 100 : 80}" rx="90" ry="30" fill="url(#neckShadow)"/>

          <!-- Armhole shadows -->
          <rect x="85" y="100" width="70" height="120" fill="url(#armShadowL)"/>
          <rect x="345" y="100" width="70" height="120" fill="url(#armShadowR)"/>

          <!-- Hem shadow -->
          <rect x="100" y="480" width="300" height="60" fill="url(#hemShadow)"/>

          <!-- Left sleeve -->
          <path d="${leftSleeve}" fill="${color}"/>
          <path d="${leftSleeve}" fill="url(#sleeveShadeL)"/>

          <!-- Right sleeve -->
          <path d="${rightSleeve}" fill="${color}"/>
          <path d="${rightSleeve}" fill="url(#sleeveShadeR)"/>

          <!-- Fold lines -->
          ${foldLines}

          <!-- Subtle fold shadows (broader) -->
          ${isFront ? `
            <path d="M185,160 Q190,300 188,480" stroke="rgba(0,0,0,${shadowOpacity * 0.15})" stroke-width="8" fill="none" opacity="0.2" stroke-linecap="round"/>
            <path d="M315,160 Q310,300 312,480" stroke="rgba(0,0,0,${shadowOpacity * 0.15})" stroke-width="8" fill="none" opacity="0.2" stroke-linecap="round"/>
            <path d="M188,160 Q193,300 190,480" stroke="rgba(255,255,255,${highlightOpacity * 0.2})" stroke-width="4" fill="none" opacity="0.15" stroke-linecap="round"/>
            <path d="M312,160 Q307,300 310,480" stroke="rgba(255,255,255,${highlightOpacity * 0.2})" stroke-width="4" fill="none" opacity="0.15" stroke-linecap="round"/>
          ` : `
            <path d="M190,120 Q195,300 192,480" stroke="rgba(0,0,0,${shadowOpacity * 0.15})" stroke-width="8" fill="none" opacity="0.2" stroke-linecap="round"/>
            <path d="M310,120 Q305,300 308,480" stroke="rgba(0,0,0,${shadowOpacity * 0.15})" stroke-width="8" fill="none" opacity="0.2" stroke-linecap="round"/>
          `}
        </g>

        <!-- ═══ Seam details ═══ -->
        <g clip-path="url(#shirtClip)" opacity="0.2">
          <!-- Shoulder seams -->
          <path d="M160,52 L130,80 L105,130" stroke="rgba(0,0,0,0.3)" stroke-width="1" fill="none" stroke-dasharray="3,3"/>
          <path d="M340,52 L370,80 L395,130" stroke="rgba(0,0,0,0.3)" stroke-width="1" fill="none" stroke-dasharray="3,3"/>

          <!-- Sleeve hems -->
          <path d="M65,192 Q80,196 100,185" stroke="rgba(0,0,0,0.25)" stroke-width="1.2" fill="none" stroke-dasharray="2,2"/>
          <path d="M435,192 Q420,196 400,185" stroke="rgba(0,0,0,0.25)" stroke-width="1.2" fill="none" stroke-dasharray="2,2"/>

          <!-- Bottom hem -->
          <path d="M110,528 Q180,540 250,542 Q320,540 390,528" stroke="rgba(0,0,0,0.3)" stroke-width="1.5" fill="none" stroke-dasharray="3,2"/>
          <path d="M112,532 Q180,544 250,546 Q320,544 388,532" stroke="rgba(0,0,0,0.15)" stroke-width="0.8" fill="none" stroke-dasharray="2,2"/>

          <!-- Side seams -->
          <path d="M100,185 L95,370 L100,470 L110,530" stroke="rgba(0,0,0,0.2)" stroke-width="0.8" fill="none" stroke-dasharray="3,4"/>
          <path d="M400,185 L405,370 L400,470 L390,530" stroke="rgba(0,0,0,0.2)" stroke-width="0.8" fill="none" stroke-dasharray="3,4"/>
        </g>

        <!-- ═══ Collar ═══ -->
        <g filter="url(#fabricTexture)">
          <!-- Collar band -->
          <path d="${collarOuter}" fill="${color}"/>
          <path d="${collarOuter}" fill="url(#collarGrad)"/>

          <!-- Collar inner edge (slightly darker) -->
          <path d="${collarInner}" fill="${color}"/>
          <path d="${collarInner}" fill="rgba(0,0,0,${shadowOpacity * 0.12})"/>

          <!-- Collar rib texture lines -->
          <path d="${collarOuter}" fill="none" stroke="rgba(0,0,0,0.06)" stroke-width="0.5" stroke-dasharray="1,1.5"/>
        </g>

        <!-- ═══ Outline ═══ -->
        <path d="${bodyPath}" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="0.8"/>

      </g>
    </svg>
  `
}

// Export for use in CriarCamisa.jsx mockup export
export { generateShirtSVG }

// ── Component ────────────────────────────────────────────────────────

export default function ShirtCanvas({ onCanvasReady, shirtColor, activeView, designs, onDesignChange }) {
  const canvasRef = useRef(null)
  const fabricRef = useRef(null)
  const containerRef = useRef(null)
  const isLoadingRef = useRef(false)

  // Initialize canvas
  useEffect(() => {
    if (fabricRef.current) return

    const c = new Canvas(canvasRef.current, {
      width: 400,
      height: 440,
      backgroundColor: 'transparent',
      selection: true,
      preserveObjectStacking: true,
    })
    fabricRef.current = c
    onCanvasReady(c)

    resizeCanvas()

    return () => {
      c.dispose()
      fabricRef.current = null
    }
  }, [])

  // Resize canvas to fit container
  const resizeCanvas = useCallback(() => {
    const container = containerRef.current
    const c = fabricRef.current
    if (!container || !c) return

    const maxWidth = Math.min(container.clientWidth, 350)
    const scale = maxWidth / 400
    c.setZoom(scale)
    c.setDimensions({ width: maxWidth, height: maxWidth * (440 / 400) })
  }, [])

  useEffect(() => {
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [resizeCanvas])

  // Load view on switch
  useEffect(() => {
    const c = fabricRef.current
    if (!c || isLoadingRef.current) return

    const loadView = async () => {
      isLoadingRef.current = true
      const json = designs[activeView]
      if (json) {
        await c.loadFromJSON(json)
        c.renderAll()
      } else {
        c.clear()
        c.backgroundColor = 'transparent'
        c.renderAll()
      }
      isLoadingRef.current = false
    }
    loadView()
  }, [activeView])

  // Notify parent of design changes
  useEffect(() => {
    const c = fabricRef.current
    if (!c) return

    function handleChange() {
      if (isLoadingRef.current) return
      const json = c.toJSON()
      onDesignChange(activeView, json)
    }

    c.on('object:modified', handleChange)
    c.on('object:added', handleChange)
    c.on('object:removed', handleChange)

    return () => {
      c.off('object:modified', handleChange)
      c.off('object:added', handleChange)
      c.off('object:removed', handleChange)
    }
  }, [activeView, onDesignChange])

  const svgMarkup = generateShirtSVG(shirtColor, activeView)

  return (
    <div className="relative flex items-center justify-center overflow-hidden">
      {/* Realistic shirt mockup wrapper */}
      <div className="relative w-full max-w-[280px] sm:max-w-[360px] lg:max-w-[420px] mx-auto overflow-hidden">
        {/* SVG Shirt Mockup */}
        <div
          className="w-full h-auto"
          dangerouslySetInnerHTML={{ __html: svgMarkup }}
        />

        {/* Fabric.js Canvas – covers all flat areas of the shirt */}
        {/* mix-blend-mode: multiply makes designs look printed on fabric */}
        <div
          ref={containerRef}
          className="absolute overflow-hidden"
          style={{
            top: '10%',
            left: '8%',
            width: '84%',
            height: '82%',
            mixBlendMode: 'multiply',
          }}
        >
          <canvas
            ref={canvasRef}
            style={{ touchAction: 'none' }}
          />
        </div>

        {/* Texture overlay on top of canvas – makes design follow fabric feel */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '10%',
            left: '8%',
            width: '84%',
            height: '82%',
          }}
        >
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.06 }}>
            <filter id="designTexture">
              <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch"/>
              <feColorMatrix type="saturate" values="0"/>
            </filter>
            <rect width="100%" height="100%" filter="url(#designTexture)"/>
          </svg>
        </div>
      </div>
    </div>
  )
}
