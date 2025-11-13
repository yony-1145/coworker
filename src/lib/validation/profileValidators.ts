// src/lib/validation/profileValidators.ts
import { commonValidators } from './commonValidators';

export const profileValidators = {
  /** 表示名：必須＋20文字以内 */
  displayName: (v: string) =>
    commonValidators.notEmpty(v, '表示名を入力してください') ||
    commonValidators.maxLength(v, 20, '表示名は20文字以内で入力してください'),

  /** ひとこと：100文字以内 */
  headline: (v: string) =>
    commonValidators.maxLength(
      v,
      100,
      'ひとことは100文字以内で入力してください'
    ),

  /** 職業：50文字以内 */
  occupation: (v: string) =>
    commonValidators.maxLength(v, 50, '職業は15文字以内で入力してください'),

  /** 所属：50文字以内 */
  affiliation: (v: string) =>
    commonValidators.maxLength(v, 50, '所属は15文字以内で入力してください'),

  /** 自己紹介：500文字以内 */
  bioText: (v: string) =>
    commonValidators.maxLength(
      v,
      500,
      '自己紹介は500文字以内で入力してください'
    ),

  /** SNSリンク：空文字を含む配列を拒否＋URL形式・重複チェック */
  links: (links: string[]) => {
    const MAX = 3;

    // 空配列は許可、空文字を含む場合はエラー
    if (links.length > 0 && links.some((l) => !l.trim())) {
      return links.map((l) => (!l.trim() ? 'URLを入力してください' : ''));
    }

    // 件数制限チェック
    const baseError = commonValidators.maxItems(
      links,
      MAX,
      `SNSリンクは最大${MAX}件までです`
    );
    if (baseError) return [baseError];

    // URL形式・重複チェック
    return links.map((link, i) => {
      const urlErr = commonValidators.url(link);
      if (urlErr) return urlErr;
      if (links.indexOf(link) !== i) return '同じURLが複数登録されています';
      return '';
    });
  },

  /** タグ：空文字要素を拒否＋件数制限＋重複チェック */
  tags: (tags: string[]) => {
    const MAX = 5;

    // 空配列は許可、中身が空ならエラー
    if (tags.length > 0 && tags.some((t) => !t.trim())) {
      return '空のタグは登録できません';
    }

    // 件数制限
    const baseError = commonValidators.maxItems(
      tags,
      MAX,
      `タグは最大${MAX}件までです`
    );
    if (baseError) return baseError;

    // 重複チェック
    const hasDuplicate = tags.some(
      (tag, idx) => tag && tags.indexOf(tag) !== idx
    );
    if (hasDuplicate) return '同じタグが複数登録されています';

    return '';
  },
};
