// SpotPopup.tsx
import UserPopup from './UserPopup';
import Link from 'next/link';

export default function SpotPopup({
  spot,
  onClose,
}: {
  spot: any;
  onClose: () => void;
}) {
  return (
    <UserPopup
      user={{
        id: spot.id,
        name: spot.title,
        image: spot.image ?? '/spot-icons/default.png',
      }}
      lat={spot.latitude}
      lng={spot.longitude}
      message={spot.description}
      onClose={onClose}
    />
  );
}
