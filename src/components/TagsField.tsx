'use client';

import React from 'react';

/**
 * 汎用タグ入力コンポーネント
 *
 * ・複数タグの追加 / 削除に対応
 * ・最大タグ数を props で制御可能
 * ・ユーザープロフィール / スポット投稿など複数画面で再利用できる
 */
export const TagsField = ({
  tags,
  errors,
  onChange,
  title,
  placeholder,
  maxTags = 10,
}: {
  tags: string[];
  errors?: string;
  onChange: (tags: string[]) => void;
  title?: string;
  placeholder?: string;
  maxTags?: number;
}) => {
  /**
   * タグ編集（特定の tag の値を変更）
   */
  const handleChange = (i: number, value: string) => {
    const newTags = tags.map((t, idx) => (idx === i ? value : t));
    onChange(newTags);
  };

  /**
   * タグ追加
   * - 空文字のタグを末尾に追加する
   * - 最大数に達している場合は追加不可
   */
  const handleAdd = () => {
    if (tags.length >= maxTags) return;
    onChange([...tags, '']);
  };

  /**
   * タグ削除
   * - index を指定してその要素を除外
   */
  const handleRemove = (i: number) => {
    onChange(tags.filter((_, idx) => idx !== i));
  };

  return (
    <div className="border-t pt-4">
      {/* セクションタイトル */}
      <h2 className="text-xl font-semibold mb-2 text-gray-900">{title}</h2>

      {/* タグ入力 UI */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <span
            key={i}
            className="flex items-center gap-1 px-3 py-1 bg-gray-50 border border-gray-300 rounded-full text-sm"
          >
            {/* タグ入力欄 */}
            <input
              type="text"
              value={tag}
              onChange={(e) => handleChange(i, e.target.value)}
              className="bg-transparent focus:outline-none w-20"
              placeholder={placeholder}
            />

            {/* 削除ボタン */}
            <button
              type="button"
              onClick={() => handleRemove(i)}
              className="text-indigo-500 hover:text-indigo-700"
            >
              ×
            </button>
          </span>
        ))}

        {/* タグ追加ボタン */}
        {tags.length < maxTags ? (
          <button
            type="button"
            onClick={handleAdd}
            className="px-3 py-1.5 bg-indigo-600 text-white rounded-full text-sm hover:bg-indigo-700"
          >
            ＋
          </button>
        ) : (
          <p className="text-sm text-gray-500 w-full text-center">
            タグは最大 {maxTags} 件までです
          </p>
        )}
      </div>

      {/* エラーメッセージ */}
      {errors && <p className="text-xs text-red-600 mt-2">{errors}</p>}
    </div>
  );
};
