'use client';
import React from 'react';

/**
 * SNSリンクの入力欄
 * - 複数URLの追加・削除
 * - 各URLのバリデーション結果を表示
 */
export const SocialLinksField = ({
  links,
  errors,
  onChange,
}: {
  links: string[];
  errors?: string[];
  onChange: (links: string[]) => void;
}) => {
  const MAX_LINKS = 5;

  const handleChange = (i: number, value: string) => {
    const newLinks = links.map((l, idx) => (idx === i ? value : l));
    onChange(newLinks);
  };

  const handleAdd = () => {
    if (links.length >= MAX_LINKS) return;
    onChange([...links, '']);
  };

  const handleRemove = (i: number) => {
    onChange(links.filter((_, idx) => idx !== i));
  };

  return (
    <div className="border-t pt-4">
      <h2 className="text-lg font-semibold mb-2 text-gray-900">SNSリンク</h2>
      <div className="flex flex-col gap-2">
        {links.map((url, i) => (
          <div
            key={i}
            className={`flex flex-col gap-1 rounded-lg border px-4 py-2 ${
              errors && errors[i]
                ? 'border-red-400 bg-red-50'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={url}
                onChange={(e) => handleChange(i, e.target.value)}
                placeholder="https://example.com"
                className="flex-1 bg-transparent focus:outline-none text-sm text-gray-800"
              />
              <button
                type="button"
                onClick={() => handleRemove(i)}
                className="text-indigo-500 hover:text-indigo-700 font-medium"
              >
                ×
              </button>
            </div>
            {errors && errors[i] && (
              <p className="text-xs text-red-600">{errors[i]}</p>
            )}
          </div>
        ))}

        {links.length < MAX_LINKS ? (
          <button
            type="button"
            onClick={handleAdd}
            className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition"
          >
            ＋ SNSリンクを追加
          </button>
        ) : (
          <p className="text-sm text-gray-500 text-center">
            登録できるSNSリンクは最大 {MAX_LINKS} 件までです
          </p>
        )}
      </div>
    </div>
  );
};
