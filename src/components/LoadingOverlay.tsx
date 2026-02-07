type LoadingOverlayProps = {
  fullScreen?: boolean;
};

/**
 * 読み込み中のオーバーレイ
 * - 読み込み中の画面を表示するためのコンポーネント
 */
export default function LoadingOverlay({
  fullScreen = false,
}: LoadingOverlayProps) {
  return (
    <div
      className={
        fullScreen
          ? 'flex min-h-screen items-center justify-center'
          : 'absolute inset-0 z-10 flex items-center justify-center'
      }
    >
      <p className="text-gray-500 animate-pulse">読み込み中...</p>
    </div>
  );
}
