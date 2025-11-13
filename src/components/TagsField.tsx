'use client';
import React from 'react';

/**
 * タグ入力欄
 * - 複数タグの追加・削除
 * - 最大数・バリデーションエラー表示
 */
export const TagsField = ({
  tags,
  errors,
  onChange,
}: {
  tags: string[];
  errors?: string;
  onChange: (tags: string[]) => void;
}) => {
  const MAX_TAGS = 10;

  const handleChange = (i: number, value: string) => {
    const newTags = tags.map((t, idx) => (idx === i ? value : t));
    onChange(newTags);
  };

  const handleAdd = () => {
    if (tags.length >= MAX_TAGS) return;
    onChange([...tags, '']);
  };

  const handleRemove = (i: number) => {
    onChange(tags.filter((_, idx) => idx !== i));
  };

  return (
    <div className="border-t pt-4">
      <h2 className="text-xl font-semibold mb-2 text-gray-900">
        興味・活動領域
      </h2>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <span
            key={i}
            className="flex items-center gap-1 px-3 py-1 bg-gray-50 border border-gray-300 rounded-full text-sm"
          >
            <input
              type="text"
              value={tag}
              onChange={(e) => handleChange(i, e.target.value)}
              className="bg-transparent focus:outline-none w-20"
              placeholder="例: React"
            />
            <button
              type="button"
              onClick={() => handleRemove(i)}
              className="text-indigo-500 hover:text-indigo-700"
            >
              ×
            </button>
          </span>
        ))}

        {tags.length < MAX_TAGS ? (
          <button
            type="button"
            onClick={handleAdd}
            className="px-3 py-1.5 bg-indigo-600 text-white rounded-full text-sm hover:bg-indigo-700"
          >
            ＋
          </button>
        ) : (
          <p className="text-sm text-gray-500 w-full text-center">
            タグは最大 {MAX_TAGS} 件までです
          </p>
        )}
      </div>

      {errors && <p className="text-xs text-red-600 mt-2">{errors}</p>}
    </div>
  );
};
