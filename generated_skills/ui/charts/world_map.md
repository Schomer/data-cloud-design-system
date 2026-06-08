---
name: world_map
category: visualizations
description: Visualizing country-level data globally via color intensity.
intent_keywords: ["global", "countries", "international", "world map"]
schema: region: string, value: number
---

# World Map Skill

## Visual Specifications
See `ui/charts/shared_visuals.md` for shared color, grid, and background attributes. You must map these visual tokens into the configuration object of the charting library you use. Do not use raw SVG data to draw charts.

## Recommended Implementation Pattern
To render a global map, you must use the Google Maps JavaScript API via native Custom Elements (`<gmp-map>`), which is fully supported by React 19.

### Step-by-Step React 19 Implementation
1. **Dynamic Script Loading**: Use a `useEffect` hook to append the official Google Maps script tag dynamically. Retrieve the API key from `localStorage.getItem('google_maps_api_key')` to allow customization.
2. **Coordinate Mapping**: Use a lookup dictionary to map country names to coordinates for placing markers.
3. **Custom Element Rendering**: Render the `<gmp-map>` element, setting its style, zoom, and center. Nest `<gmp-advanced-marker>` elements for each data point.

```jsx
import React, { useEffect, useState } from 'react';

const COUNTRY_COORDS = {
  'United States': { lat: 37.0902, lng: -95.7129 },
  'Canada': { lat: 56.1304, lng: -106.3468 },
  'Brazil': { lat: -14.2350, lng: -51.9253 },
  'United Kingdom': { lat: 55.3781, lng: -3.4360 },
  'Germany': { lat: 51.1657, lng: 10.4515 },
  'France': { lat: 46.2276, lng: 2.2137 },
  'India': { lat: 20.5937, lng: 78.9629 },
  'China': { lat: 35.8617, lng: 104.1954 },
  'Japan': { lat: 36.2048, lng: 138.2529 },
  'Australia': { lat: -25.2744, lng: 133.7751 }
};

export default function WorldMap({ data }) {
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
        Loading World Map...
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[400px] relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
      <gmp-map
        center="25.0,0.0"
        zoom="2"
        map-id="DEMO_MAP_ID"
        style={{ height: '100%', minHeight: '400px', width: '100%', display: 'block' }}
      >
        {data.map((item, idx) => {
          const coords = COUNTRY_COORDS[item.region] || COUNTRY_COORDS[item.name];
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
- Visualizing country-level or global data via geodata markers on Google Maps.
- Uses dynamic scripting and native browser Custom Elements.