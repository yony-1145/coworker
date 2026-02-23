'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { useProfileForm, type UserProfileForm } from '../hooks/useProfileForm';
import { SocialLinksField } from './SocialLinksField';
import { TagsField } from './TagsField';

/**
 * プロフィール編集フォーム
 * - すべての入力項目＋画像アップロード
 * - エラー・空要素を含む場合、保存ボタンを無効化
 *
 * 表示名は User.name を編集対象とする
 */
type ProfileFormProps = {
  initialProfile: UserProfileForm | null;
  initialUserName: string;
  id: string;
};

export const ProfileForm = ({
  initialProfile,
  initialUserName,
  id,
}: ProfileFormProps) => {
  const {
    name,
    profile,
    preview,
    errors,
    handleNameChange,
    handleChange,
    handleLinkChange,
    handleTagChange,
    handleImageChange,
    handleSubmit,
  } = useProfileForm(initialProfile, initialUserName, id);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /** 保存ボタン無効化条件 */
  const hasErrors =
    Object.values(errors).some((e) =>
      Array.isArray(e) ? e.some(Boolean) : Boolean(e),
    ) ||
    !name.trim() ||
    (profile.links?.some((l: string) => !l.trim()) ?? false) ||
    (profile.tags?.some((t: string) => !t.trim()) ?? false);

  return (
    <form
      id="profileForm"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="space-y-5 overflow-y-auto max-h-[calc(100vh-180px)] pr-1"
    >
      {/* ヘッダー（画像＋表示名） */}
      <div className="flex items-center gap-6">
        <div
          className="relative w-24 h-24 cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <Image
            src={preview || '/user-icons/default.png'}
            alt={name}
            width={96}
            height={96}
            unoptimized
            className="w-24 h-24 rounded-full shadow-md border-4 border-white dark:border-gray-800 object-cover hover:opacity-80 transition"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e)}
            className="hidden"
          />
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            表示名
          </label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className={`w-full rounded-md border px-3 py-1.5 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-indigo-400 transition ${
              errors.name
                ? 'border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
            }`}
            placeholder="名前"
          />
          {errors.name && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.name}</p>
          )}
        </div>
      </div>

      {/* ひとこと */}
      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
          ひとこと
        </label>
        <input
          type="text"
          name="headline"
          value={profile.headline || ''}
          onChange={(e) => handleChange('headline', e.target.value)}
          className={`w-full rounded-md border px-3 py-1.5 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-indigo-400 transition ${
            errors.headline
              ? 'border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-900/20'
              : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
          }`}
          placeholder="ひとこと"
        />
        {errors.headline && (
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.headline}</p>
        )}
      </div>

      {/* 職業・所属・自己紹介 */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
        <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
          職業・所属・自己紹介
        </h2>

        <div className="flex flex-wrap gap-3 mb-3">
          <div className="flex-1 min-w-[45%]">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              職業
            </label>
            <input
              type="text"
              name="occupation"
              value={profile.occupation || ''}
              onChange={(e) => handleChange('occupation', e.target.value)}
              className={`w-full rounded-md border px-3 py-1.5 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-indigo-400 transition ${
                errors.occupation
                  ? 'border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-900/20'
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
              }`}
              placeholder="職種"
            />
            {errors.occupation && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.occupation}</p>
            )}
          </div>

          <div className="flex-1 min-w-[45%]">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              所属
            </label>
            <input
              type="text"
              name="affiliation"
              value={profile.affiliation || ''}
              onChange={(e) => handleChange('affiliation', e.target.value)}
              className={`w-full rounded-md border px-3 py-1.5 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-indigo-400 transition ${
                errors.affiliation
                  ? 'border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-900/20'
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
              }`}
              placeholder="所属"
            />
            {errors.affiliation && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.affiliation}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            自己紹介
          </label>
          <textarea
            name="bioText"
            value={profile.bioText || ''}
            onChange={(e) => handleChange('bioText', e.target.value)}
            rows={3}
            placeholder="あなたの活動や目標について書いてください"
            className={`w-full rounded-md border px-3 py-2 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-indigo-400 transition ${
              errors.bioText
                ? 'border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
            }`}
          />
          {errors.bioText && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.bioText}</p>
          )}
        </div>
      </div>

      {/* SNSリンク */}
      <SocialLinksField
        links={profile.links ?? []}
        errors={errors.links as string[]}
        onChange={handleLinkChange}
      />

      {/* タグ */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
        <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">タグ</h2>
        <TagsField
          tags={profile.tags ?? []}
          errors={errors.tags as string}
          onChange={handleTagChange}
        />
      </div>

      {/* 保存ボタン */}
      <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
        <button
          type="submit"
          disabled={hasErrors}
          className={`w-full py-2 rounded-lg text-sm font-medium transition ${
            hasErrors
              ? 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {hasErrors ? '修正が必要です' : '保存'}
        </button>
      </div>
    </form>
  );
};
