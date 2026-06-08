---
name: usa_map
category: visualizations
description: Best for visualizing state-level data across the United States.
intent_keywords: ["map", "geo", "spatial", "location", "usa", "usa map"]
schema: region: string, value: number
---

# Usa Map Skill

## Visual Specifications
See `ui/charts/shared_visuals.md` for shared color, grid, and background attributes. You must map these visual tokens into the configuration object of the charting library you use. Do not use raw SVG data to draw charts.

## Recommended Implementation Pattern
To render a United States map, you must use the Google Maps JavaScript API via native Custom Elements (`<gmp-map>`), which is fully supported by React 19.

### Step-by-Step React 19 Implementation
1. **Dynamic Script Loading**: Use a `useEffect` hook to append the official Google Maps script tag dynamically. Retrieve the API key from `localStorage.getItem('google_maps_api_key')` to allow customization.
2. **State Coordinate Mapping**: Use a lookup dictionary to map US State names to coordinates for placing markers.
3. **Custom Element Rendering**: Render the `<gmp-map>` element, setting its style, zoom, and center. Nest `<gmp-advanced-marker>` elements for each state.

```jsx
import React, { useEffect, useState } from 'react';

const STATE_COORDS = {
  'California': { lat: 36.7783, lng: -119.4179 },
  'Texas': { lat: 31.9686, lng: -99.9018 },
  'New York': { lat: 40.7128, lng: -74.0060 },
  'Florida': { lat: 27.6648, lng: -81.5158 },
  'Illinois': { lat: 40.6331, lng: -89.3985 },
  'Pennsylvania': { lat: 41.2033, lng: -77.1945 },
  'Ohio': { lat: 40.4173, lng: -82.9071 },
  'Georgia': { lat: 32.1656, lng: -82.9001 },
  'North Carolina': { lat: 35.7596, lng: -79.0193 },
  'Michigan': { lat: 44.3148, lng: -85.6024 },
  'Washington': { lat: 47.7511, lng: -120.7401 },
  'CA': { lat: 36.7783, lng: -119.4179 },
  'TX': { lat: 31.9686, lng: -99.9018 },
  'NY': { lat: 40.7128, lng: -74.0060 },
  'FL': { lat: 27.6648, lng: -81.5158 }
};

export default function USAMap({ data }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const scriptId = 'google-maps-script';
    let script = document.getElementById(scriptId);
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      const apiKey = localStorage.getItem('google_maps_api_key') || '';
      const keyParam = apiKey ? `&key=${apiKey}` : '';
      script.src = `https://maps.googleapis.com/maps/api/js?v=weekly&libraries=marker,maps${keyParam}&internal-usage-attribution-ids=gmp_mcp_codeassist_v0.1_github`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    const checkLoaded = () => {
      if (window.google && window.google.maps) {
        setLoaded(true);
      } else {
        setTimeout(checkLoaded, 100);
      }
    };
    checkLoaded();
  }, []);

  if (!loaded) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 text-sm">
        Loading USA Map...
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[400px] relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
      <gmp-map
        center="39.8283,-98.5795"
        zoom="4"
        map-id="DEMO_MAP_ID"
        style={{ height: '100%', minHeight: '400px', width: '100%', display: 'block' }}
      >
        {data.map((item, idx) => {
          const coords = STATE_COORDS[item.region] || STATE_COORDS[item.name];
          if (!coords) return null;
          return (
            <gmp-advanced-marker
              key={idx}
              position={`${coords.lat},${coords.lng}`}
              title={`${item.region || item.name}: ${item.value}`}
            />
          );
        })}
      </gmp-map>
    </div>
  );
}
```

## Usage Context
- Visualizing state-level or regional data across the United States.
- Uses dynamic script loading and native browser Custom Elements.