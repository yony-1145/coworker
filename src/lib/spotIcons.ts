/**
 * スポット用デフォルトアイコン
 * ジャンルに応じたURLを返す:
 */
export function getDefaultSpotIconByGenre(
  genre?: 'CAFE' | 'COWORKING' | 'OTHER' | null,
): string {
  switch (genre) {
    case 'CAFE':
      return '/spot-icons/cafe.svg';
    case 'COWORKING':
      return '/spot-icons/cowoking.svg';
    case 'OTHER':
    default:
      return '/spot-icons/pin.svg';
  }
}
