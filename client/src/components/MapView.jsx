import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet.heat';
import { MapPin, Locate } from 'lucide-react';

const MapView = ({ reports = [] }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersGroupRef = useRef(null);
  const heatLayerRef = useRef(null);
  const userMarkerRef = useRef(null);
  const [viewMode, setViewMode] = useState('pins'); // 'pins' or 'heatmap'
  const [userCoords, setUserCoords] = useState(null);
  const [isGeolocationDenied, setIsGeolocationDenied] = useState(false);
  const hasCenteredOnUserRef = useRef(false);
  const hasCenteredOnReportsRef = useRef(false);

  // Get user's current location on mount
  useEffect(() => {
    let isMounted = true;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (!isMounted) return;
          const { latitude, longitude } = position.coords;
          setUserCoords({ lat: latitude, lng: longitude });
        },
        (error) => {
          if (!isMounted) return;
          console.log('Geolocation error:', error);
          setIsGeolocationDenied(true);
        }
      );
    } else {
      setIsGeolocationDenied(true);
    }
    return () => {
      isMounted = false;
    };
  }, []);

  const safeSetView = (map, coords, zoom) => {
    if (map && map._container && map._mapPane) {
      try {
        map.setView(coords, zoom);
      } catch (e) {
        console.warn('Map setView skipped safely:', e);
      }
    }
  };

  const handleRealign = () => {
    const map = mapRef.current;
    if (!map || !map._container || !map._mapPane) return;

    if (userCoords) {
      safeSetView(map, [userCoords.lat, userCoords.lng], 13);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (mapRef.current !== map || !map._container) return;
          const { latitude, longitude } = position.coords;
          const coords = { lat: latitude, lng: longitude };
          setUserCoords(coords);
          safeSetView(map, [latitude, longitude], 13);
        },
        (error) => {
          if (mapRef.current !== map || !map._container) return;
          console.log('Geolocation error, realigning to default:', error);
          safeSetView(map, [16.4879, 80.6935], 13);
        }
      );
    } else {
      safeSetView(map, [16.4879, 80.6935], 13);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved':
        return 'bg-green-500';
      case 'In Progress':
        return 'bg-yellow-500';
      case 'Rejected':
        return 'bg-gray-500';
      case 'Pending':
      default:
        return 'bg-red-500';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Resolved':
        return '<span class="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800">Resolved</span>';
      case 'In Progress':
        return '<span class="px-2 py-0.5 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">In Progress</span>';
      default:
        return '<span class="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-800">Pending</span>';
    }
  };

  // 1. Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Create map instance
    const map = L.map(mapContainerRef.current, {
      zoomControl: false // We will position zoom control on bottom right
    });
    safeSetView(map, [16.4879, 80.6935], 12);
    mapRef.current = map;

    // Add zoom control to bottom right
    L.control.zoom({
      position: 'bottomright'
    }).addTo(map);

    // Add CartoDB Positron style tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    // Create layer groups
    markersGroupRef.current = L.layerGroup().addTo(map);

    return () => {
      if (mapRef.current) {
        try {
          mapRef.current.off();
          mapRef.current.remove();
        } catch (e) {
          // ignore cleanup errors
        }
        mapRef.current = null;
      }
    };
  }, []);

  // 2. Render Markers and Heatmap based on data and view mode
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map._container || !map._mapPane) return;

    // Clear existing layers
    if (markersGroupRef.current) {
      markersGroupRef.current.clearLayers();
    }
    if (heatLayerRef.current) {
      try {
        map.removeLayer(heatLayerRef.current);
      } catch (e) {}
      heatLayerRef.current = null;
    }
    if (userMarkerRef.current) {
      try {
        map.removeLayer(userMarkerRef.current);
      } catch (e) {}
      userMarkerRef.current = null;
    }

    // Add user marker if coordinates are available
    if (userCoords) {
      const userIcon = L.divIcon({
        html: `<div class="relative flex items-center justify-center w-6 h-6">
                 <div class="absolute w-full h-full rounded-full bg-blue-500 opacity-40 animate-ping"></div>
                 <div class="relative w-3.5 h-3.5 rounded-full bg-blue-600 border-2 border-white shadow-md"></div>
               </div>`,
        className: 'user-location-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const userMarker = L.marker([userCoords.lat, userCoords.lng], { icon: userIcon })
        .bindPopup('<div class="p-1 font-sans text-xs font-semibold text-neutral-800">You are here</div>', {
          className: 'custom-leaflet-popup',
        });
      
      userMarker.addTo(map);
      userMarkerRef.current = userMarker;
    }

    const validReports = reports.filter((r) => {
      const lat = Number(r.location?.coordinates?.lat);
      const lng = Number(r.location?.coordinates?.lng);
      return !isNaN(lat) && !isNaN(lng) && (lat !== 0 || lng !== 0);
    });

    if (viewMode === 'pins') {
      // Add markers
      validReports.forEach((report) => {
        const lat = Number(report.location.coordinates.lat);
        const lng = Number(report.location.coordinates.lng);
        const colorClass = getStatusColor(report.status);

        // Custom HTML Marker using L.divIcon
        const icon = L.divIcon({
          html: `<div class="w-8 h-8 rounded-full ${colorClass} flex items-center justify-center shadow-lg border-2 border-white transform transition-all duration-300 hover:scale-125">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                 </div>`,
          className: 'custom-div-icon',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -16],
        });

        // Popup HTML matching glassmorphism style
        const popupContent = `
          <div class="p-2 font-sans w-64">
            <div class="flex items-center justify-between mb-2 gap-2">
              <h4 class="font-bold text-sm text-neutral-900 m-0 line-clamp-1">${report.title}</h4>
              ${getStatusBadge(report.status)}
            </div>
            <p class="text-xs text-neutral-600 mb-2 leading-relaxed line-clamp-2">${report.description}</p>
            <div class="flex justify-between items-center text-xs border-t border-neutral-100 pt-2 mt-1">
              <span class="text-neutral-500 font-medium">${Array.isArray(report.category) ? report.category.join(', ') : report.category}</span>
              <span class="font-semibold text-neutral-800">${report.priority} Priority</span>
            </div>
          </div>
        `;

        const marker = L.marker([lat, lng], { icon })
          .bindPopup(popupContent, {
            className: 'custom-leaflet-popup',
            maxWidth: 280,
          });

        markersGroupRef.current.addLayer(marker);
      });
    } else if (viewMode === 'heatmap') {
      // Build heat points array [lat, lng, intensity]
      const heatPoints = validReports.map((report) => {
        const lat = Number(report.location.coordinates.lat);
        const lng = Number(report.location.coordinates.lng);
        const intensity =
          report.priority === 'High' || report.priority === 'Critical'
            ? 1.0
            : report.priority === 'Medium'
            ? 0.6
            : 0.3;
        return [lat, lng, intensity];
      });

      if (heatPoints.length > 0) {
        heatLayerRef.current = L.heatLayer(heatPoints, {
          radius: 25,
          blur: 15,
          maxZoom: 15,
          gradient: {
            0.4: 'blue',
            0.6: 'cyan',
            0.7: 'lime',
            0.8: 'yellow',
            1.0: 'red',
          },
        }).addTo(map);
      }
    }

    // Auto fit bounds to report markers if available
    if (validReports.length > 0 && !hasCenteredOnReportsRef.current) {
      try {
        const bounds = L.latLngBounds(
          validReports.map((r) => [
            Number(r.location.coordinates.lat),
            Number(r.location.coordinates.lng)
          ])
        );
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
        hasCenteredOnReportsRef.current = true;
      } catch (e) {
        console.warn('Map fitBounds skipped safely:', e);
      }
    } else if (userCoords && !hasCenteredOnUserRef.current) {
      safeSetView(map, [userCoords.lat, userCoords.lng], 13);
      hasCenteredOnUserRef.current = true;
    } else if (isGeolocationDenied && !hasCenteredOnUserRef.current) {
      safeSetView(map, [16.4879, 80.6935], 13);
      hasCenteredOnUserRef.current = true;
    }
  }, [reports, viewMode, userCoords, isGeolocationDenied]);

  return (
    <div className="relative bg-neutral-100 rounded-2xl overflow-hidden shadow-soft border border-neutral-200" style={{ height: '500px' }}>
      {/* Map Element */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Realign Control Button */}
      <button
        type="button"
        onClick={handleRealign}
        className="absolute top-4 right-4 z-[1000] bg-white/95 backdrop-blur-md p-2.5 rounded-xl shadow-medium border border-neutral-200/50 hover:bg-neutral-100 active:bg-neutral-200 transition-all duration-300 group flex items-center justify-center"
        title="Realign to current location / PVP Siddhartha"
      >
        <Locate className="h-5 w-5 text-neutral-600 group-hover:text-primary-600 group-hover:scale-110 transition-all duration-300" />
      </button>

      {/* Control Overlay for Toggling Modes */}
      <div className="absolute top-4 left-4 z-[1000] bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-medium flex items-center space-x-2 border border-neutral-200/50">
        <button
          onClick={() => setViewMode('pins')}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
            viewMode === 'pins'
              ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-sm'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <MapPin className="h-3.5 w-3.5" />
          <span>Issues Pins</span>
        </button>
        <button
          onClick={() => setViewMode('heatmap')}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
            viewMode === 'heatmap'
              ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-sm'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <div className="w-3.5 h-3.5 rounded-full bg-red-500 animate-pulse inline-block border border-white" />
          <span>Heatmap Density</span>
        </button>
      </div>

      {/* Custom styles in head */}
      <style>{`
        .custom-leaflet-popup .leaflet-popup-content-wrapper {
          border-radius: 1rem;
          padding: 0px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(229, 231, 235, 0.5);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        .custom-leaflet-popup .leaflet-popup-content {
          margin: 0px;
          padding: 8px;
        }
        .custom-leaflet-popup .leaflet-popup-tip {
          background: rgba(255, 255, 255, 0.95);
        }
      `}</style>

      {/* Map Legend */}
      {viewMode === 'pins' && (
        <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-medium border border-neutral-200/50">
          <h4 className="font-bold text-xs mb-2 text-neutral-900">Issue Status</h4>
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full border border-white shadow-sm"></div>
              <span className="text-[10px] font-medium text-neutral-600">Pending</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full border border-white shadow-sm"></div>
              <span className="text-[10px] font-medium text-neutral-600">In Progress</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full border border-white shadow-sm"></div>
              <span className="text-[10px] font-medium text-neutral-600">Resolved</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-500 rounded-full border border-white shadow-sm"></div>
              <span className="text-[10px] font-medium text-neutral-600">Rejected</span>
            </div>
          </div>
        </div>
      )}

      {/* Heatmap Legend */}
      {viewMode === 'heatmap' && (
        <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-medium border border-neutral-200/50">
          <h4 className="font-bold text-xs mb-2 text-neutral-900">Issue Density</h4>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-medium text-neutral-500">Low</span>
            <div className="w-24 h-2 rounded bg-gradient-to-r from-blue-500 via-lime-500 to-red-500 border border-neutral-200"></div>
            <span className="text-[10px] font-medium text-neutral-500">High</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;
