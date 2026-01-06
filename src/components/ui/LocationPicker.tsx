import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in Leaflet with React
// This is necessary because Webpack/Vite often messes up the icon imports
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Location {
    lat: number;
    lng: number;
}

interface LocationPickerProps {
    value: Location;
    onChange: (location: Location) => void;
}

const LocationMarker: React.FC<{ value: Location, onChange: (loc: Location) => void }> = ({ value, onChange }) => {
    const map = useMapEvents({
        click(e) {
            onChange(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    // Ensure map flies to the initial value's location on load
    useEffect(() => {
        if (value) {
            map.flyTo(value, map.getZoom());
        }
    }, [map]);

    return value === null ? null : (
        <Marker position={value} />
    );
};

export const LocationPicker: React.FC<LocationPickerProps> = ({ value, onChange }) => {
    // Default center (Tashkent) if no value provided
    const center = value && value.lat !== 0 ? value : { lat: 41.2995, lng: 69.2401 };

    return (
        <div className="h-[300px] w-full rounded-xl overflow-hidden border border-border/50 relative z-0">
            <MapContainer
                center={center}
                zoom={13}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker value={value} onChange={onChange} />
            </MapContainer>
        </div>
    );
};
