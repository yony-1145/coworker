'use client';

import { useEffect, useState, useMemo } from 'react';
import { Map, Marker, Popup } from 'react-map-gl/maplibre';

export default function HomePage() {
  const [locations, setLocations] = useState([]); // APIからのデータ
  const [popupInfo, setPopupInfo] = useState<any | null>(null);

  // デフォルト表示（東京）
  const initialView = {
    longitude: 139.6917,
    latitude: 35.6895,
    zoom: 10,
  };

  // API Routeからデータ取得
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/locations');
      const data = await res.json();
      setLocations(data);
    };
    fetchData();
  }, []);

  console.log(locations);

  // MarkerをuseMemoで生成
  const pins = useMemo(
    () =>
      locations.map((loc: any, index: number) => (
        <Marker
          key={`marker-${index}`}
          longitude={loc.lng}
          latitude={loc.lat}
          anchor="bottom"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            setPopupInfo(loc);
          }}
        >
          <div
            style={{
              width: '12px',
              height: '12px',
              backgroundColor: 'blue',
              borderRadius: '50%',
              border: '2px solid white',
            }}
          />
        </Marker>
      )),
    [locations]
  );

  return (
    <main style={{ width: '100%', height: '100vh' }}>
      <Map
        initialViewState={initialView}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        style={{ width: '100%', height: '100%' }}
      >
        {pins}

        {popupInfo && (
          <Popup
            longitude={popupInfo.lng}
            latitude={popupInfo.lat}
            anchor="top"
            onClose={() => setPopupInfo(null)}
          >
            <div>
              <strong>{popupInfo.user?.name}</strong>
              <p>{popupInfo.message ?? 'No message'}</p>
            </div>
          </Popup>
        )}
      </Map>
    </main>
  );
}
