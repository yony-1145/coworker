'use client';

import { Map, Marker } from 'react-map-gl/maplibre';

export default function HomePage() {
  const initialView = {
    longitude: 139.6917, // 東京
    latitude: 35.6895,
    zoom: 10,
  };

  return (
    <main style={{ width: '100%', height: '100vh' }}>
      <Map
        initialViewState={initialView}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        style={{ width: '100%', height: '100%' }}
      >
        <Marker longitude={139.6917} latitude={35.6895} />
      </Map>
    </main>
  );
}
