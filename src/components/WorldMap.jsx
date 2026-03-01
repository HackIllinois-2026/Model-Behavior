import { useState, useRef, useEffect, useCallback } from 'react'
import { COUNTRIES } from '../gameData'
import mapImage from '../../resources/HackAstra Game Map.png'

// Quick lookup: region id → {x, y}
const REGION_COORDS = Object.fromEntries(COUNTRIES.map(c => [c.id, { x: c.x, y: c.y }]))

// Adjacent region connections for the SVG arc layer
const ARCS = [
  ['c1', 'c3'],
  ['c1', 'c2'],
  ['c3', 'c4'],
  ['c4', 'c5'],
  ['c4', 'c7'],
  ['c5', 'c6'],
  ['c6', 'c7'],
  ['c2', 'c7'],
]

export default function WorldMap({ countries, selectedCountry, phase, onCountryClick }) {
  const [hovered, setHovered]   = useState(null)
  const wrapperRef              = useRef(null)
  const imgRef                  = useRef(null)
  // Tracks the actual rendered image rect inside the container (px)
  const [imgRect, setImgRect]   = useState({ left: 0, top: 0, w: 0, h: 0 })
  const isTargeting = phase === 'select-country'

  const computeRect = useCallback(() => {
    const img  = imgRef.current
    const wrap = wrapperRef.current
    if (!img || !wrap || !img.naturalWidth) return
    const cW    = wrap.clientWidth
    const cH    = wrap.clientHeight
    const scale = Math.min(cW / img.naturalWidth, cH / img.naturalHeight)
    const rW    = img.naturalWidth  * scale
    const rH    = img.naturalHeight * scale
    setImgRect({ left: (cW - rW) / 2, top: (cH - rH) / 2, w: rW, h: rH })
  }, [])

  useEffect(() => {
    const obs = new ResizeObserver(computeRect)
    if (wrapperRef.current) obs.observe(wrapperRef.current)
    return () => obs.disconnect()
  }, [computeRect])

  // Handle browsers that don't fire onLoad for cached images
  useEffect(() => {
    const img = imgRef.current
    if (img?.complete && img?.naturalWidth) computeRect()
  }, [computeRect])

  return (
    <div className="map-container">
      <div className="map-wrapper" ref={wrapperRef}>
        <img
          ref={imgRef}
          src={mapImage}
          alt="Alien planet map"
          className="world-map-img"
          draggable={false}
          onLoad={computeRect}
        />

        {/* Periodic scan-line sweep */}
        <div className="map-scan-line" />

        {/* Pins overlay — positioned exactly over the rendered image pixels */}
        <div
          className="map-pins-overlay"
          style={{
            position: 'absolute',
            left:     imgRect.left,
            top:      imgRect.top,
            width:    imgRect.w,
            height:   imgRect.h,
            overflow: 'visible',
            pointerEvents: 'none',
          }}
        >
          {/* SVG data-flow arcs — rendered first so pins appear on top */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              overflow: 'visible',
            }}
          >
            {ARCS.map(([fromId, toId]) => {
              const from     = REGION_COORDS[fromId]
              const to       = REGION_COORDS[toId]
              const isActive = (countries[fromId]?.usage > 50) || (countries[toId]?.usage > 50)
              return (
                <line
                  key={`${fromId}-${toId}`}
                  x1={from.x} y1={from.y}
                  x2={to.x}   y2={to.y}
                  className={`map-arc${isActive ? ' arc-active' : ''}`}
                />
              )
            })}
          </svg>

          {COUNTRIES.map(country => {
            const cs       = countries[country.id]
            const isHov    = hovered === country.id
            const isSel    = selectedCountry === country.id
            const captured = cs.usage >= 90

            const pulseClass = cs.usage >= 90 ? 'pulse-captured'
                             : cs.usage >= 70 ? 'pulse-high'
                             : cs.usage >= 30 ? 'pulse-med'
                             : 'pulse-low'

            return (
              <div
                key={country.id}
                className="country-pin"
                style={{ left: `${country.x}%`, top: `${country.y}%` }}
              >
                {/* Marker circle */}
                <div
                  className={[
                    'country-marker',
                    isSel       ? 'selected'   : '',
                    isTargeting ? 'targetable' : '',
                    captured    ? 'captured'   : '',
                  ].filter(Boolean).join(' ')}
                  style={{ pointerEvents: 'all' }}
                  onClick={() => onCountryClick(country.id)}
                  onMouseEnter={() => setHovered(country.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {/* Pulsing ring — always on, speed/color based on usage */}
                  <div className={`pin-pulse ${pulseClass}`} />

                  <span className="country-label">{country.label}</span>

                  {/* Tooltip */}
                  {(isHov || isSel) && (
                    <div className="country-tooltip">
                      <div className="ct-title">Region {country.label}</div>
                      <div className="ct-row">
                        <span className="ct-key">Usage</span>
                        <span className="ct-val usage-col">{Math.round(cs.usage)}%</span>
                      </div>
                      <div className="ct-row">
                        <span className="ct-key">Perception</span>
                        <span className={`ct-val ${cs.perception >= 0 ? 'perc-pos' : 'perc-neg'}`}>
                          {cs.perception > 0 ? '+' : ''}{Math.round(cs.perception)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Usage + perception bars below marker */}
                <div className="country-bars">
                  <div className="cb-track">
                    <div className="cb-fill cb-usage" style={{ width: `${cs.usage}%` }} />
                  </div>
                  <div className="cb-track cb-perc-track">
                    <div className="cb-center-mark" />
                    {(() => {
                      const clamped = Math.max(-100, Math.min(100, cs.perception))
                      const isNeg   = clamped < 0
                      const halfW   = Math.abs(clamped) / 2
                      return (
                        <div
                          className={`cb-perc-fill ${isNeg ? 'cb-perc-neg' : 'cb-perc-pos'}`}
                          style={{
                            width: `${halfW}%`,
                            left:  isNeg ? `${50 - halfW}%` : '50%',
                          }}
                        />
                      )
                    })()}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
