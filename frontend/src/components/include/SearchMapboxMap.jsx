import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set your Mapbox access token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const SearchMapboxMap = forwardRef(
    (
        {
            initialCenter = [79.8612, 6.9271], // Colombo default coordinates
            initialZoom = 13,
            properties = [],
            universityLocation = null,
        },
        ref
    ) => {
        const mapContainerRef = useRef(null);
        const mapRef = useRef(null);
        const markersRef = useRef([]);
        const popupsRef = useRef([]);
        const universityMarkerRef = useRef(null);

        // Expose map methods to parent component
        useImperativeHandle(ref, () => ({
            getMap: () => mapRef.current,
            panTo: (coords) => {
                if (mapRef.current) {
                    mapRef.current.flyTo({
                        center: [coords.longitude, coords.latitude],
                        zoom: 14,
                        essential: true,
                    });
                }
            },
            resize: () => {
                if (mapRef.current) {
                    mapRef.current.resize();
                }
            }
        }));

        // Initialize map
        useEffect(() => {
            if (!mapContainerRef.current || mapRef.current) return;

            mapRef.current = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: initialCenter,
                zoom: initialZoom,
            });

            // Add navigation and scale controls
            mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
            mapRef.current.addControl(
                new mapboxgl.ScaleControl({ position: 'bottom-right' })
            );
            mapRef.current.addControl(
                new mapboxgl.GeolocateControl({
                    positionOptions: { enableHighAccuracy: true },
                }),
                'bottom-right'
            );

            // Clean up on unmount
            return () => {
                if (mapRef.current) {
                    mapRef.current.remove();
                    mapRef.current = null;
                }
            };
        }, []);

        // Add university marker with radius circle
        useEffect(() => {
            if (!mapRef.current || !universityLocation) return;

            // Make sure the map is fully loaded
            if (!mapRef.current.isStyleLoaded()) {
                console.log('Map style not fully loaded yet, waiting...');
                const checkLoaded = setInterval(() => {
                    if (mapRef.current && mapRef.current.isStyleLoaded()) {
                        clearInterval(checkLoaded);
                        addUniversityMarkerAndRadius();
                    }
                }, 100);
                return;
            }

            addUniversityMarkerAndRadius();

            function addUniversityMarkerAndRadius() {
                // Clean up previous university marker
                if (universityMarkerRef.current) {
                    universityMarkerRef.current.remove();
                    universityMarkerRef.current = null;
                }

                // Clean up previous radius circle if exists
                if (mapRef.current.getSource('radius-source')) {
                    mapRef.current.removeLayer('radius-fill');
                    mapRef.current.removeLayer('radius-outline');
                    mapRef.current.removeSource('radius-source');
                }

                try {
                    // Create a proper 5km radius circle using turf.js
                    const coordinates = [universityLocation.longitude, universityLocation.latitude];
                    const point = turf.point(coordinates);
                    const radiusInKm = 5;
                    const options = { steps: 64, units: 'kilometers' };
                    const circlePolygon = turf.circle(point, radiusInKm, options);

                    // Add the circle to the map
                    mapRef.current.addSource('radius-source', {
                        type: 'geojson',
                        data: circlePolygon
                    });

                    // Add a visible fill layer
                    mapRef.current.addLayer({
                        id: 'radius-fill',
                        type: 'fill',
                        source: 'radius-source',
                        paint: {
                            'fill-color': '#006845',
                            'fill-opacity': 0.15
                        }
                    });

                    // Add a clear border
                    mapRef.current.addLayer({
                        id: 'radius-outline',
                        type: 'line',
                        source: 'radius-source',
                        paint: {
                            'line-color': '#006845',
                            'line-width': 2,
                            'line-opacity': 0.8
                        }
                    });

                    // Create custom university marker element
                    const universityEl = document.createElement('div');
                    universityEl.className = 'university-marker';
                    universityEl.innerHTML = `
                        <div style="background-color: #4A90E2; width: 36px; height: 36px; border-radius: 50%; 
                                    border: 3px solid white; display: flex; align-items: center; justify-content: center;
                                    box-shadow: 0 3px 6px rgba(0,0,0,0.5); z-index: 2;">
                          <span style="color: white; font-weight: bold; font-size: 16px;">U</span>
                        </div>
                    `;

                    // Add marker to map
                    universityMarkerRef.current = new mapboxgl.Marker({
                        element: universityEl,
                    })
                        .setLngLat(coordinates)
                        .addTo(mapRef.current);

                    console.log('University marker and 5km radius circle added at:', coordinates);

                    // Add popup for university
                    new mapboxgl.Popup({
                        closeButton: false,
                        closeOnClick: false,
                        offset: 25,
                        className: 'university-popup',
                    })
                        .setLngLat(coordinates)
                        .setHTML(`<p style="font-weight: bold; margin: 0;">University</p>`)
                        .addTo(mapRef.current);
                } catch (error) {
                    console.error('Error adding university marker and radius:', error);
                }
            }

            return () => {
                // Clean up radius circle on unmount or when universityLocation changes
                if (mapRef.current && mapRef.current.getSource('radius-source')) {
                    mapRef.current.removeLayer('radius-fill');
                    mapRef.current.removeLayer('radius-outline');
                    mapRef.current.removeSource('radius-source');
                }
            };
        }, [universityLocation]);

        // Add property markers
        useEffect(() => {
            if (!mapRef.current) return;

            // Make sure the map is fully loaded
            if (!mapRef.current.isStyleLoaded()) {
                console.log('Map style not fully loaded yet for property markers, waiting...');
                const checkLoaded = setInterval(() => {
                    if (mapRef.current && mapRef.current.isStyleLoaded()) {
                        clearInterval(checkLoaded);
                        addPropertyMarkers();
                    }
                }, 100);
                return;
            }

            addPropertyMarkers();

            function addPropertyMarkers() {
                // Clean up previous markers
                markersRef.current.forEach(marker => marker.remove());
                markersRef.current = [];

                popupsRef.current.forEach(popup => popup.remove());
                popupsRef.current = [];

                console.log('Adding markers for', properties.length, 'properties');

                // Add markers for each property
                properties.forEach(property => {
                    try {
                        if (!property.longitude || !property.latitude) {
                            console.warn('Property missing coordinates:', property);
                            return;
                        }

                        // Create property marker element
                        const el = document.createElement('div');
                        el.className = 'property-marker';
                        el.innerHTML = `
                          <div style="background-color: #FF5A5F; width: 32px; height: 32px; border-radius: 50%; 
                                      border: 3px solid white; display: flex; align-items: center; justify-content: center;
                                      box-shadow: 0 3px 6px rgba(0,0,0,0.5); z-index: 1;">
                            <span style="color: white; font-weight: bold; font-size: 14px;">P</span>
                          </div>
                        `;

                        // Make marker element clickable
                        el.style.cursor = 'pointer';
                        el.addEventListener('click', () => {
                            window.location.href = property.link;
                        });

                        // Add marker to map
                        const marker = new mapboxgl.Marker({
                            element: el,
                        })
                            .setLngLat([property.longitude, property.latitude])
                            .addTo(mapRef.current);

                        markersRef.current.push(marker);
                        console.log('Added marker at:', property.longitude, property.latitude);

                        // Create popup with property info
                        const popup = new mapboxgl.Popup({
                            closeButton: true,
                            closeOnClick: false,
                            offset: 25,
                            maxWidth: '300px',
                        })
                            .setLngLat([property.longitude, property.latitude])
                            .setHTML(`
                            <div style="width: 100%;">
                              ${property.image ?
                                    `<img src="${property.image}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 4px 4px 0 0;">` :
                                    '<div style="width: 100%; height: 80px; background-color: #eee; display: flex; align-items: center; justify-content: center; border-radius: 4px 4px 0 0;">No image</div>'
                                }
                              <h3 style="margin: 8px 0 4px; font-size: 16px; font-weight: bold;">${property.name}</h3>
                              <p style="margin: 0 0 8px; font-size: 14px;">LKR ${property.price.toLocaleString()}/month</p>
                              <a href="${property.link}" style="display: block; text-align: center; background-color: #006845; color: white; padding: 6px; border-radius: 4px; text-decoration: none; font-size: 14px;">View Details</a>
                            </div>
                        `);

                        // Show popup on marker hover
                        marker.getElement().addEventListener('mouseenter', () => {
                            popup.addTo(mapRef.current);
                            popupsRef.current.push(popup);
                        });

                        marker.getElement().addEventListener('mouseleave', () => {
                            setTimeout(() => {
                                // Only remove if not being hovered directly
                                if (!popup.getElement().matches(':hover')) {
                                    popup.remove();
                                    popupsRef.current = popupsRef.current.filter(p => p !== popup);
                                }
                            }, 300);
                        });
                    } catch (error) {
                        console.error('Error adding property marker:', error, property);
                    }
                });

                // Fit bounds to include all markers if we have properties and university
                if (properties.length > 0 && universityLocation) {
                    try {
                        const bounds = new mapboxgl.LngLatBounds();

                        // Add university to bounds
                        bounds.extend([universityLocation.longitude, universityLocation.latitude]);

                        // Add properties to bounds
                        properties.forEach(property => {
                            if (property.longitude && property.latitude) {
                                bounds.extend([property.longitude, property.latitude]);
                            }
                        });

                        mapRef.current.fitBounds(bounds, {
                            padding: 70,
                            maxZoom: 15,
                        });
                        console.log('Bounds adjusted to fit all markers');
                    } catch (error) {
                        console.error('Error fitting bounds:', error);
                    }
                }
            }
        }, [properties, universityLocation]);

        return (
            <>
                <style jsx>{`
                    .mapboxgl-marker {
                        z-index: 1;
                    }
                    .university-marker {
                        z-index: 2;
                    }
                `}</style>
                <div
                    ref={mapContainerRef}
                    style={{ height: '100%', width: '100%' }}
                    className="rounded-lg shadow-md min-h-[500px]"
                />
            </>
        );
    }
);

SearchMapboxMap.displayName = 'SearchMapboxMap';
export default SearchMapboxMap;