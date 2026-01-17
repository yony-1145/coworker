import { supabase } from '@/lib/supabase';

type UploadPublicImageArgs = {
  bucket: string;
  file: File; //保存先ディレクトリ（例: 'users', 'spots'）;
  dir?: string; // ファイル名のベース（例: userId, spotId） ;
  filenameBase?: string;
  upsert?: boolean;
};

/**
 * Supabase Storage（Publicバケット）に画像をアップロードし、公開URLを返す
 * - Storageには「ファイル」だけを置き、DBには publicUrl（文字列）を保存する用途を想定
 * - パスは `dir/filenameBase_timestamp.ext` 形式で一意性を確保する
 * - バケットがPublicでない場合、getPublicUrlは使えない（Signed URL方式が必要）
 */
export async function uploadPublicImage({
  bucket,
  file,
  dir = '',
  filenameBase = crypto.randomUUID(),
  upsert = true,
}: UploadPublicImageArgs) {
  //拡張子をファイル名から推定する（無ければ png 扱い）
  const ext = file.name.split('.').pop()?.toLowerCase() || 'png';

  // アップロード先パスを組み立て
  const path = [dir, `${filenameBase}_${Date.now()}.${ext}`]
    .filter(Boolean)
    .join('/');

  //Storageへアップロード
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      upsert,
      contentType: file.type || undefined,
    });

  if (uploadError) throw uploadError;

  // Public URL を取得して返す
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);

  return { publicUrl: data.publicUrl, path };
}
