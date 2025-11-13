/**
 * 共通で利用する汎用バリデーション関数群
 * - 単項目のシンプルな検証ルールを提供
 */
export const commonValidators = {
  /** 必須入力チェック */
  notEmpty: (v: string, msg = '必須項目です'): string =>
    !v?.trim() ? msg : '',

  /** 最大文字数チェック */
  maxLength: (v: string, max: number, msg?: string): string =>
    v?.length > max ? (msg ?? `${max}文字以内で入力してください`) : '',

  /** URL形式チェック */
  url: (v: string): string =>
    /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i.test(v)
      ? ''
      : '有効なURLを入力してください',

  /** 配列の最大件数チェック */
  maxItems: (arr: any[], max: number, msg?: string): string =>
    arr.length > max ? (msg ?? `${max}件以内で入力してください`) : '',
};
