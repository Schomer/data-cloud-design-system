---
name: geo_point_map
category: visualizations
description: Maps individual data points geographically by coordinates.
intent_keywords: ["geo point", "coordinates", "lat long", "map", "geo point map"]
schema: latitude: number, longitude: number, value: number
---

# Geo Point Map Skill

## Visual Specifications
See `ui/charts/shared_visuals.md` for shared color, grid, and background attributes. You must map these visual tokens into the configuration object of the charting library you use. Do not use raw SVG data to draw charts.

## Recommended Implementation Pattern
To render a coordinate-based point map, you must use the Google Maps JavaScript API via native Custom Elements (`<gmp-map>`), which is fully supported by React 19.

### Step-by-Step React 19 Implementation
1. **Dynamic Script Loading**: Use a `useEffect` hook to append the official Google Maps script tag dynamically. Retrieve the API key from `localStorage.getItem('google_maps_api_key')` to allow customization.
2. **Custom Element Rendering**: Render the `<gmp-map>` element, setting its style, zoom, and center. Nest `<gmp-advanced-marker>` elements for each data coordinate.

```jsx
import React, { useEffect, useState } from 'react';

export default function GeoPointMap({ data }) {
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
        Loading Map Coordinates...
      </div>
    );
  }

  // Calculate default center if points exist
  const firstPoint = data?.[0];
  const centerLat = firstPoint?.latitude || 37.7749;
  const centerLng = firstPoint?.longitude || -122.4194;

  return (
    <div className="w-full h-full min-h-[400px] relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
      <gmp-map
        center={`${centerLat},${centerLng}`}
        zoom="3"
        map-id="DEMO_MAP_ID"
        style={{ height: '100%', minHeight: '400px', width: '100%', display: 'block' }}
      >
        {data.map((item, idx) => (
          <gmp-advanced-marker
            key={idx}
            position={`${item.latitude},${item.longitude}`}
            title={`Value: ${item.value}`}
          />
        ))}
      </gmp-map>
    </div>
  );
}
```

## Usage Context
- Maps individual data points geographically by coordinates (latitude/longitude) using dynamic script loading and native Custom Elements.