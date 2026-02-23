/** アップロードファイルの最大サイズ（5MB） */
export const UPLOAD_MAX_BYTES = 5 * 1024 * 1024;

/** ファイル名から拡張子を取得する。無い場合は 'png' を返す。 */
export function getExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : 'png';
}

/** アップロード種別（spot / user） */
export type UploadType = 'spot' | 'user';

/** アップロード入力検証の結果 */
export type ValidateUploadResult =
  | { ok: true; type: UploadType; ext: string; file: File }
  | { ok: false; message: string };

/**
 * アップロード API 用の入力検証（ファイル・type・MIME・サイズ）。
 * Supabase を呼ばずに 400 になるケースだけを判定する。
 */
export function validateUploadInput(
  file: File | FormDataEntryValue | null,
  typeRaw: FormDataEntryValue | null,
): ValidateUploadResult {
  if (!(file instanceof File)) {
    return { ok: false, message: 'ファイルを選択してください' };
  }

  const type = typeof typeRaw === 'string' ? typeRaw : 'spot';
  if (type !== 'spot' && type !== 'user') {
    return {
      ok: false,
      message: 'type は "spot" または "user" を指定してください',
    };
  }

  if (!file.type.startsWith('image/')) {
    return { ok: false, message: '画像ファイルのみアップロードできます' };
  }

  if (file.size > UPLOAD_MAX_BYTES) {
    return { ok: false, message: 'ファイルサイズは5MB以内にしてください' };
  }

  const ext = getExtension(file.name);
  return { ok: true, type: type as UploadType, ext, file };
}
