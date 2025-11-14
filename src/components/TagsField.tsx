'use client';

import React from 'react';

interface TagsFieldProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  errors?: string;
}

/**
 * TagsField（横に展開されていくタグ入力 UI）
 *
 * ・タグは inline-flex で横並び
 * ・＋ボタンで右に新しい input が追加される
 * ・タグ1つ = pillスタイル
 * ・タイトルは外に出す（ページ側で管理）
 */
export const TagsField = ({
  tags,
  onChange,
  placeholder = '',
  maxTags = 10,
  errors,
}: TagsFieldProps) => {
  /** タグ編集 */
  const handleChange = (i: number, value: string) => {
    const newTags = tags.map((t, idx) => (idx === i ? value : t));
    onChange(newTags);
  };

  /** タグ追加 */
  const handleAdd = () => {
    if (tags.length >= maxTags) return;
    onChange([...tags, '']);
  };

  /** タグ削除 */
  const handleRemove = (i: number) => {
    onChange(tags.filter((_, idx) => idx !== i));
  };

  return (
    <div className="space-y-2">
      {/* 横に展開されるタグ領域 */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <div
            key={i}
            className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 border border-gray-300 rounded-full"
          >
            {/* 固定幅のインプット：横に広がらず pill としてまとまる */}
            <input
              type="text"
              value={tag}
              onChange={(e) => handleChange(i, e.target.value)}
              className="bg-transparent focus:outline-none text-sm w-24"
              placeholder={placeholder}
            />

            <button
              type="button"
              onClick={() => handleRemove(i)}
              className="text-gray-500 hover:text-red-600 text-sm"
            >
              ×
            </button>
          </div>
        ))}

        {/* タグ追加ボタン（pill サイズ） */}
        {tags.length < maxTags && (
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700"
          >
            ＋ 追加
          </button>
        )}
      </div>

      {/* エラーメッセージ */}
      {errors && <p className="text-xs text-red-600">{errors}</p>}
    </div>
  );
};
