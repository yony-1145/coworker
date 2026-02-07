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

      <select
        value={crowdLevel}
        onChange={(e) => onChangeCrowdLevel(e.target.value as CrowdLevel)}
        className={`inline-flex items-center cursor-pointer px-4 py-2 pr-8 rounded-full text-sm font-medium transition-all border-0 focus:outline-none focus:ring-0 appearance-none bg-no-repeat ${
          crowdLevel === 'ALL'
            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
        }`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
          backgroundSize: '0.75rem',
          backgroundPosition: 'right 0.5rem center',
        }}
        aria-label="混雑度"
      >
        <option value="ALL">混雑度</option>
        <option value="LOW">空いている</option>
        <option value="MID">普通</option>
        <option value="HIGH">混雑している</option>
      </select>
    </section>
  );
}
