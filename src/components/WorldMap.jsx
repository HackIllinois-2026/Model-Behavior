import { useState } from 'react'
import { REGIONS } from '../gameData'

const MAP_URL =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/World_map_-_low_resolution.svg/1280px-World_map_-_low_resolution.svg.png'

export default function WorldMap({ selectedRegion, dataCentersByRegion, onSelectRegion }) {
  const [hoveredRegion, setHoveredRegion] = useState(null)

  return (
    <div className="map-container">
      <div className="map-wrapper">
        <img
          src={MAP_URL}
          alt="World map"
          className="world-map-img"
          draggable={false}
        />

        {REGIONS.map(region => {
          const centers = dataCentersByRegion[region.id] || 0
          const isSelected = selectedRegion === region.id
          const isHovered = hoveredRegion === region.id

          let markerClass = 'region-marker'
          if (centers > 0) markerClass += ' has-centers'
          if (isSelected) markerClass += ' selected'

          return (
            <div
              key={region.id}
              className={markerClass}
              style={{ left: `${region.x}%`, top: `${region.y}%` }}
              onClick={() => onSelectRegion(region.id)}
              onMouseEnter={() => setHoveredRegion(region.id)}
              onMouseLeave={() => setHoveredRegion(null)}
            >
              {(isHovered || isSelected) && (
                <div className="region-tooltip">{region.name}</div>
              )}
              {centers > 0 && (
                <div className="dc-badge">{centers}</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
