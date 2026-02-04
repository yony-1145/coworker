'use client';

/**
 * スポットのフィルターUI
 */
export type CrowdLevel = 'LOW' | 'MID' | 'HIGH' | 'ALL';

export type SpotFiltersProps = {
  hasWifi: boolean;
  hasPower: boolean;
  crowdLevel: CrowdLevel;
  onChangeHasWifi: (next: boolean) => void;
  onChangeHasPower: (next: boolean) => void;
  onChangeCrowdLevel: (next: CrowdLevel) => void;
};

// フィルタの切り替えや値更新をハンドルする処理
export default function SpotFilters({
  hasWifi,
  hasPower,
  crowdLevel,
  onChangeHasWifi,
  onChangeHasPower,
  onChangeCrowdLevel,
}: SpotFiltersProps) {
  return (
    <section className="flex flex-wrap items-center gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <label
          className={`inline-flex items-center cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition-all ${
            hasWifi
              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <input
            type="checkbox"
            checked={hasWifi}
            onChange={(e) => onChangeHasWifi(e.target.checked)}
            className="sr-only"
          />
          Wi-Fiあり
        </label>
        <label
          className={`inline-flex items-center cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition-all ${
            hasPower
              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <input
            type="checkbox"
            checked={hasPower}
            onChange={(e) => onChangeHasPower(e.target.checked)}
            className="sr-only"
          />
          電源あり
        </label>
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        混雑度
        <select
          value={crowdLevel}
          onChange={(e) => onChangeCrowdLevel(e.target.value as CrowdLevel)}
          className="bg-gray-50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:bg-gray-100 transition-colors"
        >
          <option value="ALL">すべて</option>
          <option value="LOW">空いている</option>
          <option value="MID">普通</option>
          <option value="HIGH">混雑している</option>
        </select>
      </label>
    </section>
  );
}
