import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

// Custom colorful marker icon
const colorfulIcon = L.icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyLjUgMEMyLjUgMCAwIDEwIDAgMTBDMCAxMCAwIDIwIDEyLjUgNDBDMjUgMjAgMjUgMTAgMjUgMTBDMjUgMTAgMjIuNSAwIDEyLjUgMFoiIGZpbGw9IiNGQzZDNkMiLz4KPGNpcmNsZSBjeD0iMTIuNSIgY3k9IjEyLjUiIHI9IjUuNSIgZmlsbD0id2hpdGUiLz4KPC9zdmc+',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const Map = ({ properties }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      // Initialize map with custom style
      mapInstanceRef.current = L.map(mapRef.current, {
        zoomControl: false, // We'll add it manually to position it
      }).setView([-17.820, 31.050], 14);

      // Add colorful tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);

      // Add zoom control to top-right
      L.control.zoom({
        position: 'topright'
      }).addTo(mapInstanceRef.current);

      // Add markers with custom styling
      properties.forEach((property) => {
        const marker = L.marker(property.position, {
          icon: colorfulIcon,
          riseOnHover: true
        }).addTo(mapInstanceRef.current);

        // Create popup content with vibrant colors
        const popupContent = document.createElement('div');
        popupContent.className = 'p-4 min-w-[300px] bg-white rounded-lg';
        popupContent.innerHTML = `
          <div class="relative">
            <img 
              src="${property.image}" 
              alt="${property.title}"
              class="w-full h-48 object-cover mb-3 rounded-lg shadow-md hover:opacity-90 transition-opacity"
            />
            <div class="absolute top-2 right-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
              ${property.price}/mo
            </div>
          </div>
          <h3 class="font-bold text-xl text-gray-800 mb-2">${property.title}</h3>
          <p class="text-gray-600 text-sm mb-4 flex items-center">
            <svg class="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
            </svg>
            ${property.location}
          </p>
          <button class="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-md font-medium">
            View Details
          </button>
        `;

        // Custom popup options
        const popupOptions = {
          className: 'custom-popup',
          maxWidth: 320,
          closeButton: false,
        };

        marker.bindPopup(popupContent, popupOptions);
      });

      // Add custom CSS for colorful map
      const style = document.createElement('style');
      style.textContent = `
        .custom-popup .leaflet-popup-content-wrapper {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          border: none;
          overflow: hidden;
        }
        .custom-popup .leaflet-popup-tip {
          background: white;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .leaflet-control-zoom a {
          background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%) !important;
          color: white !important;
          border: none !important;
          width: 32px;
          height: 32px;
          line-height: 32px;
          font-size: 16px;
          border-radius: 8px !important;
          margin-bottom: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .leaflet-control-zoom a:hover {
          background: linear-gradient(135deg, #2563EB 0%, #7C3AED 100%) !important;
        }
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: none !important;
        }
        .leaflet-container {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
      `;
      document.head.appendChild(style);
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [properties]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full rounded-xl overflow-hidden shadow-2xl"
      style={{ zIndex: 0 }}
    />
  );
};

export default Map; 