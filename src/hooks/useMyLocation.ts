'use client';

import { useEffect, useState } from 'react';

export function useMyLocation(mapRef: any, currentUserEmail: string) {
  const [myLocation, setMyLocation] = useState<any | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // --- localStorageから復元 ---
  useEffect(() => {
    const saved = localStorage.getItem('myLocation');
    if (saved) {
      setMyLocation(JSON.parse(saved));
    }
  }, []);

  // --- 現在地取得＆APIにPOST ---
  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn('このブラウザは位置情報をサポートしていません。');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const newLoc = { lat: latitude, lng: longitude };
        setMyLocation(newLoc);
        localStorage.setItem('myLocation', JSON.stringify(newLoc));

        await fetch('/api/locations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: currentUserEmail,
            lat: latitude,
            lng: longitude,
            message: '現在地を更新しました。',
          }),
        });
      },
      (err) => console.error('位置情報の取得に失敗しました:', err)
    );
  }, [currentUserEmail]);

  // --- flyTo ---
  useEffect(() => {
    if (mapLoaded && myLocation && mapRef.current) {
      mapRef.current.flyTo({
        center: [myLocation.lng, myLocation.lat],
        zoom: 12,
        speed: 1.5,
      });
    }
  }, [mapLoaded, myLocation]);

  return { myLocation, setMapLoaded };
}
