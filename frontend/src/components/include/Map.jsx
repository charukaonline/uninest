import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Map = ({ initialCenter = [6.9271, 79.8612], initialZoom = 13, onLocationSelect, selectedLocations = [] }) => {
    const mapRef = useRef(null);
    const mapContainerRef = useRef(null);
    const [isMapReady, setIsMapReady] = useState(false);

    useEffect(() => {
        // Wait for next tick to ensure DOM is ready
        const timer = setTimeout(() => {
            if (!mapContainerRef.current || isMapReady) return;

            mapRef.current = L.map(mapContainerRef.current).setView(initialCenter, initialZoom);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap contributors',
            }).addTo(mapRef.current);

            setIsMapReady(true);
        }, 100);

        return () => {
            clearTimeout(timer);
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
                setIsMapReady(false);
            }
        };
    }, []);

    useEffect(() => {
        if (!mapRef.current || !isMapReady) return;

        // Clear existing markers
        mapRef.current.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
                layer.remove();
            }
        });

        // Add markers for selected locations
        selectedLocations.forEach(location => {
            L.marker([location.latitude, location.longitude]).addTo(mapRef.current);
        });

        const handleMapClick = (e) => {
            const { lat, lng } = e.latlng;
            if (onLocationSelect) {
                onLocationSelect({ latitude: lat, longitude: lng });
            }
        };

        mapRef.current.on('click', handleMapClick);

        return () => {
            if (mapRef.current) {
                mapRef.current.off('click', handleMapClick);
            }
        };
    }, [isMapReady, selectedLocations, onLocationSelect]);

    return (
        <div 
            ref={mapContainerRef} 
            style={{ height: '420px', width: '620px' }} 
            className='rounded-lg border border-gray-300'
        />
    );
}

export default Map;