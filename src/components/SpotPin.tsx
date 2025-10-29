import UserPin from './UserPin';

export default function SpotPin({
  spot,
  onClick,
}: {
  spot: any;
  onClick?: () => void;
}) {
  return (
    <UserPin
      user={{
        name: spot.title,
        image: spot.image ?? '/spot-icons/default.png',
      }}
      lat={spot.latitude}
      lng={spot.longitude}
      showName={true}
      onClick={onClick}
    />
  );
}
