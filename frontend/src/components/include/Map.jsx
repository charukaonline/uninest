import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const Map = ({
  initialCenter = [6.9271, 79.8612],
  initialZoom = 13,
  onLocationSelect,
  selectedLocations = [],
}) => {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const markerRef = useRef(null);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current || isMapReady) return;

    mapRef.current = L.map(mapContainerRef.current).setView(
      initialCenter,
      initialZoom
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap contributors",
    }).addTo(mapRef.current);

    setIsMapReady(true);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        setIsMapReady(false);
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !isMapReady) return;

    // Clear existing marker
    if (markerRef.current) {
      markerRef.current.remove();
    }

    // Add marker for selected location
    if (selectedLocations.length > 0) {
      const location = selectedLocations[0];
      markerRef.current = L.marker([
        location.latitude,
        location.longitude,
      ]).addTo(mapRef.current);
    }

    const handleMapClick = (e) => {
      const { lat, lng } = e.latlng;

      if (markerRef.current) {
        markerRef.current.remove();
      }

      markerRef.current = L.marker([lat, lng]).addTo(mapRef.current);

      if (onLocationSelect) {
        onLocationSelect({ latitude: lat, longitude: lng });
      }
    };

    mapRef.current.on("click", handleMapClick);

    return () => {
      if (mapRef.current) {
        mapRef.current.off("click", handleMapClick);
      }
    };
  }, [isMapReady, selectedLocations, onLocationSelect]);

  return (
    <div
      ref={mapContainerRef}
      className="rounded-lg border border-gray-300 w-full h-full"
    />
  );
};

export default Map;
