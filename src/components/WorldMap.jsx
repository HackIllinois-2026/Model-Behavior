import { useState } from 'react'
import { COUNTRIES } from '../gameData'
import mapImage from '../../resources/HackAstra Game Map.png'

export default function WorldMap({ countries, selectedCountry, phase, onCountryClick }) {
  const [hovered, setHovered] = useState(null)
  const isTargeting = phase === 'select-country'

  return (
    <div className="map-container">
      <div className="map-wrapper">
        <img
          src={mapImage}
          alt="Alien planet map"
          className="world-map-img"
          draggable={false}
        />

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
                  isSel      ? 'selected'   : '',
                  isTargeting ? 'targetable' : '',
                  captured   ? 'captured'   : '',
                ].filter(Boolean).join(' ')}
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
                      <span className="ct-key">Influence</span>
                      <span className="ct-val infl-col">{Math.round(cs.influence)}%</span>
                    </div>
                    <div className="ct-row">
                      <span className="ct-key">Suspicion</span>
                      <span className="ct-val susp-col">{Math.round(cs.suspicion)}%</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Three mini progress bars below marker */}
              <div className="country-bars">
                <div className="cb-track">
                  <div className="cb-fill cb-usage"    style={{ width: `${cs.usage}%` }}     />
                </div>
                <div className="cb-track">
                  <div className="cb-fill cb-influence" style={{ width: `${cs.influence}%` }} />
                </div>
                <div className="cb-track">
                  <div className="cb-fill cb-suspicion" style={{ width: `${cs.suspicion}%` }} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
