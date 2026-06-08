import React, { useEffect, useRef, useState } from 'react';
import { useChartColors } from '../context/ChartColorContext';
import { useEditor } from '../context/EditorContext';
import { Key, Check, RotateCcw, AlertTriangle } from 'lucide-react';

// Keep track of the script loading promise globally so it is not created multiple times
let googleMapsPromise = null;

function loadGoogleMapsScript(apiKey) {
    if (googleMapsPromise) return googleMapsPromise;

    googleMapsPromise = new Promise((resolve, reject) => {
        if (window.google && window.google.maps) {
            resolve(window.google.maps);
            return;
        }

        const scriptId = 'google-maps-script';
        let script = document.getElementById(scriptId);
        
        if (script) {
            script.remove(); // Remove existing script tag if any to force reload
        }

        script = document.createElement('script');
        script.id = scriptId;
        script.type = 'text/javascript';
        const keyParam = apiKey ? `&key=${apiKey}` : '';
        // Load Maps JS API with marker library
        script.src = `https://maps.googleapis.com/maps/api/js?v=weekly&libraries=marker,maps${keyParam}&internal-usage-attribution-ids=gmp_mcp_codeassist_v0.1_github`;
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
            if (window.google && window.google.maps) {
                resolve(window.google.maps);
            } else {
                reject(new Error('Google Maps loaded but maps namespace not found'));
            }
        };

        script.onerror = () => {
            reject(new Error('Failed to load Google Maps script'));
        };

        document.head.appendChild(script);
    });

    return googleMapsPromise;
}

function clearGoogleMapsScript() {
    googleMapsPromise = null;
    if (window.google) {
        // Safe deletion of google namespaces
        try {
            delete window.google;
        } catch (e) {
            window.google = undefined;
        }
    }
    const script = document.getElementById('google-maps-script');
    if (script) {
        script.remove();
    }
}

const defaultPoints = [
    { name: 'San Francisco', lat: 37.7749, lng: -122.4194, value: 85, desc: 'Active Hub - 85 Nodes' },
    { name: 'New York', lat: 40.7128, lng: -74.0060, value: 92, desc: 'HQ Office - 92 Nodes' },
    { name: 'London', lat: 51.5074, lng: -0.1278, value: 74, desc: 'EMEA Gateway - 74 Nodes' },
    { name: 'Tokyo', lat: 35.6762, lng: 139.6503, value: 65, desc: 'APAC Hub - 65 Nodes' },
    { name: 'Sydney', lat: -33.8688, lng: 151.2093, value: 58, desc: 'Oceania Regional - 58 Nodes' },
    { name: 'Berlin', lat: 52.5200, lng: 13.4050, value: 70, desc: 'EU Central - 70 Nodes' },
    { name: 'São Paulo', lat: -23.5505, lng: -46.6333, value: 62, desc: 'LATAM Regional - 62 Nodes' }
];

const lightStyles = [
    { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
    { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
    { featureType: "poi", elementType: "geometry", stylers: [{ color: "#eeeeee" }] },
    { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#dadada" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9c9c9" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] }
];

const darkStyles = [
    { elementType: "geometry", stylers: [{ color: "#1e293b" }] }, // slate-800
    { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] }, // slate-400
    { elementType: "labels.text.stroke", stylers: [{ color: "#0f172a" }] }, // slate-900
    { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#475569" }] },
    { featureType: "poi", elementType: "geometry", stylers: [{ color: "#1e293b" }] },
    { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#0f172a" }] },
    { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#64748b" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#334155" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#0f172a" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#475569" }] }
];

export default function GoogleMapChart({ height = '350px' }) {
    const containerRef = useRef(null);
    const mapRef = useRef(null);
    const markersRef = useRef([]);
    const infoWindowRef = useRef(null);

    const { theme } = useEditor();
    const { chartColors } = useChartColors();
    const isDarkMode = theme === 'dark';

    const [apiKey, setApiKey] = useState(() => localStorage.getItem('google_maps_api_key') || '');
    const [tempKey, setTempKey] = useState(apiKey);
    const [showSettings, setShowSettings] = useState(false);
    const [loadError, setLoadError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [savedSuccess, setSavedSuccess] = useState(false);

    // Primary marker color matching the chart theme
    const primaryColor = chartColors?.[0] || (isDarkMode ? '#3b82f6' : '#2563eb');

    // Create marker DOM node securely
    const createMarkerElement = (point, color) => {
        const size = Math.round(14 + point.value * 0.12);

        const container = document.createElement('div');
        container.className = 'relative flex items-center justify-center';
        container.style.width = `${size * 2.5}px`;
        container.style.height = `${size * 2.5}px`;

        // Outer pulsing wave
        const pulseRing = document.createElement('div');
        pulseRing.className = 'absolute rounded-full map-marker-pulse pointer-events-none';
        pulseRing.style.width = '100%';
        pulseRing.style.height = '100%';
        pulseRing.style.backgroundColor = color;
        pulseRing.style.opacity = '0.35';
        container.appendChild(pulseRing);

        // Inner solid dot
        const solidDot = document.createElement('div');
        solidDot.className = 'absolute rounded-full border-2 border-white dark:border-slate-900 shadow-md cursor-pointer transition-transform duration-200 hover:scale-125';
        solidDot.style.width = `${size}px`;
        solidDot.style.height = `${size}px`;
        solidDot.style.backgroundColor = color;
        container.appendChild(solidDot);

        return container;
    };

    // Create InfoWindow content securely without using innerHTML
    const createInfoWindowContent = (point) => {
        const container = document.createElement('div');
        container.className = 'p-3 text-slate-800 dark:text-slate-100 min-w-[180px] bg-white dark:bg-slate-900 border-none rounded-lg';

        const title = document.createElement('div');
        title.className = 'font-bold text-sm mb-1';
        title.textContent = point.name;
        container.appendChild(title);

        const desc = document.createElement('div');
        desc.className = 'text-xs text-slate-500 dark:text-slate-400 mb-2';
        desc.textContent = point.desc;
        container.appendChild(desc);

        const footer = document.createElement('div');
        footer.className = 'flex items-center justify-between gap-4 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800';

        const badge = document.createElement('span');
        badge.className = 'text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400';
        badge.textContent = 'Activity';
        footer.appendChild(badge);

        const value = document.createElement('span');
        value.className = 'text-xs font-bold';
        value.textContent = `${point.value}%`;
        footer.appendChild(value);

        container.appendChild(footer);
        return container;
    };

    // Load Maps API and Initialize Map
    useEffect(() => {
        let active = true;
        setLoadError(null);

        loadGoogleMapsScript(apiKey)
            .then((maps) => {
                if (!active) return;
                setIsLoaded(true);

                // Setup InfoWindow once
                if (!infoWindowRef.current) {
                    infoWindowRef.current = new maps.InfoWindow({
                        disableAutoPan: false
                    });
                }

                // Map Options
                const mapOptions = {
                    center: { lat: 25, lng: 0 },
                    zoom: 2,
                    mapId: 'DEMO_MAP_ID', // DEMO_MAP_ID enables Advanced Markers
                    styles: isDarkMode ? darkStyles : lightStyles,
                    disableDefaultUI: true,
                    zoomControl: true,
                    backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc'
                };

                // Instantiate Map
                if (containerRef.current) {
                    const newMap = new maps.Map(containerRef.current, mapOptions);
                    mapRef.current = newMap;

                    // Clear previous markers
                    markersRef.current.forEach(m => m.setMap(null));
                    markersRef.current = [];

                    // Render Custom Pulsing Advanced Markers
                    defaultPoints.forEach((point) => {
                        const markerElement = createMarkerElement(point, primaryColor);
                        
                        const marker = new maps.marker.AdvancedMarkerElement({
                            map: newMap,
                            position: { lat: point.lat, lng: point.lng },
                            content: markerElement,
                            title: point.name
                        });

                        // Event listener for InfoWindow
                        marker.addListener('click', () => {
                            const infoContent = createInfoWindowContent(point);
                            infoWindowRef.current.setContent(infoContent);
                            infoWindowRef.current.open({
                                anchor: marker,
                                map: newMap
                            });
                        });

                        markersRef.current.push(marker);
                    });
                }
            })
            .catch((err) => {
                if (active) {
                    console.error('Google Maps API failed to load:', err);
                    setLoadError(err.message || 'Failed to load Google Maps SDK');
                }
            });

        return () => {
            active = false;
        };
    }, [apiKey, primaryColor]);

    // Handle theme/styles update on existing map instances dynamically
    useEffect(() => {
        if (mapRef.current && window.google && window.google.maps) {
            mapRef.current.setOptions({
                styles: isDarkMode ? darkStyles : lightStyles,
                backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc'
            });
        }
    }, [isDarkMode]);

    const handleSaveKey = (e) => {
        e.preventDefault();
        const trimmedKey = tempKey.trim();
        localStorage.setItem('google_maps_api_key', trimmedKey);
        setApiKey(trimmedKey);
        setSavedSuccess(true);
        clearGoogleMapsScript(); // Force script reload with new key
        
        setTimeout(() => {
            setSavedSuccess(false);
            setShowSettings(false);
        }, 1500);
    };

    const handleClearKey = () => {
        localStorage.removeItem('google_maps_api_key');
        setApiKey('');
        setTempKey('');
        clearGoogleMapsScript(); // Force script reload without key
        setShowSettings(false);
    };

    return (
        <div className="relative w-full h-full min-h-[300px] rounded-lg overflow-hidden group">
            {/* dynamic keyframes for markers */}
            <style>{`
                @keyframes map-pulse {
                    0% {
                        transform: scale(0.4);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(2.0);
                        opacity: 0;
                    }
                }
                .map-marker-pulse {
                    animation: map-pulse 2.2s cubic-bezier(0.1, 0.8, 0.3, 1) infinite;
                }
                /* Clean up Google Maps InfoWindow default styling padding and borders */
                .gm-style .gm-style-iw-c {
                    padding: 0 !important;
                    background-color: transparent !important;
                    border-radius: 8px !important;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
                }
                .gm-style .gm-style-iw-d {
                    overflow: hidden !important;
                    max-height: none !important;
                }
                .gm-style .gm-style-iw-tc::after {
                    background: white !important;
                }
                .dark .gm-style .gm-style-iw-tc::after {
                    background: #0f172a !important;
                }
            `}</style>

            {/* Map Canvas */}
            <div ref={containerRef} className="w-full h-full absolute inset-0" />

            {/* Load error state */}
            {loadError && (
                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white z-20">
                    <AlertTriangle className="text-amber-500 mb-3" size={36} />
                    <h4 className="font-semibold text-lg mb-1">Maps SDK Error</h4>
                    <p className="text-slate-400 text-sm max-w-xs mb-4">{loadError}</p>
                    <button 
                        onClick={() => setShowSettings(true)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                        <Key size={14} /> Configure API Key
                    </button>
                </div>
            )}

            {/* API Key Panel Button */}
            <button
                onClick={() => setShowSettings(!showSettings)}
                className="absolute top-4 right-4 z-10 p-2 bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-md rounded-lg text-slate-700 dark:text-slate-300 transition-colors"
                title="Google Maps API Settings"
            >
                <Key size={16} className={apiKey ? "text-emerald-500" : "text-slate-400"} />
            </button>

            {/* API Key Dialog Popover */}
            {showSettings && (
                <div className="absolute top-16 right-4 z-20 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-xl p-4 text-slate-800 dark:text-slate-200 transition-all duration-200 animate-in fade-in slide-in-from-top-2">
                    <h5 className="font-bold text-sm mb-1">Google Maps API Key</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                        Enter your API key to enable interactive maps and geodata features. Key is stored locally in your browser.
                    </p>
                    
                    <form onSubmit={handleSaveKey} className="space-y-3">
                        <input
                            type="password"
                            value={tempKey}
                            onChange={(e) => setTempKey(e.target.value)}
                            placeholder="AIzaSy..."
                            className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-blue-500 text-slate-800 dark:text-slate-100"
                        />
                        
                        <div className="flex gap-2 justify-end pt-1">
                            {apiKey && (
                                <button
                                    type="button"
                                    onClick={handleClearKey}
                                    className="px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 text-[10px] font-semibold rounded-lg flex items-center gap-1 transition-colors"
                                >
                                    <RotateCcw size={10} /> Clear
                                </button>
                            )}
                            <button
                                type="submit"
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-semibold rounded-lg flex items-center gap-1 transition-colors"
                            >
                                {savedSuccess ? (
                                    <>
                                        <Check size={10} /> Saved
                                    </>
                                ) : (
                                    'Save Key'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Watermark/Status Indicator */}
            <div className="absolute bottom-2 left-2 z-10 px-2 py-0.5 bg-white/70 dark:bg-slate-950/70 border border-slate-200/50 dark:border-slate-800/50 rounded text-[9px] text-slate-500 dark:text-slate-400 backdrop-blur-sm pointer-events-none select-none">
                {apiKey ? 'API Mode' : 'Demo Mode (Watermarked)'}
            </div>
        </div>
    );
}
