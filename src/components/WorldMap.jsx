import { useState, useRef, useEffect, useCallback } from 'react'
import { COUNTRIES } from '../gameData'
import mapImage from '../../resources/HackAstra Game Map.png'

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
          {COUNTRIES.map(country => {
            const cs       = countries[country.id]
            const isHov    = hovered === country.id
            const isSel    = selectedCountry === country.id
            const captured = cs.usage >= 90

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

                {/* Single usage bar below marker */}
                <div className="country-bars">
                  <div className="cb-track">
                    <div className="cb-fill cb-usage" style={{ width: `${cs.usage}%` }} />
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
