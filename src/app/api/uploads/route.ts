import { getServerSession, type AuthOptions } from 'next-auth';
import { supabaseServer } from '@/lib/supabase/server';
import { authOptions } from '@/lib/authOptions';
import { error, success } from '@/lib/apiResponse';
import { validateUploadInput } from '@/lib/validation/uploadValidators';

/**
 * 画像アップロード API
 *
 * 仕様：
 * - ログイン必須
 * - type: "spot" | "user" でバケットを切り替え
 * - 画像のみ・最大5MB
 */
export async function POST(req: Request) {
  try {
    // ログインユーザのみ許可
    const session = await getServerSession(authOptions as AuthOptions);
    const userId = (session?.user as { id?: string } | undefined)?.id;
    if (!userId) {
      return error('ログインしてください', 401);
    }

    const formData = await req.formData();
    const fileEntry = formData.get('file');
    const typeRaw = formData.get('type');

    const validated = validateUploadInput(fileEntry, typeRaw);
    if (!validated.ok) {
      return error(validated.message, 400);
    }

    const { type, ext, file } = validated;
    const bucket = type === 'user' ? 'user-icons' : 'spot-images';
    const dir = type === 'user' ? 'users' : 'spots';
    const filePath = `${dir}/${userId}_${Date.now()}.${ext}`;

    // Supabase Storage へアップロード
    const { error: uploadError } = await supabaseServer.storage
      .from(bucket)
      .upload(filePath, file, { upsert: true, contentType: file.type });

    if (uploadError) {
      console.error(uploadError);
      return error('アップロードに失敗しました', 500);
    }

    // 公開URLを取得して返却
    const { data } = supabaseServer.storage.from(bucket).getPublicUrl(filePath);

    return success({ url: data.publicUrl }, 201);
  } catch (err: unknown) {
    console.error('api/uploads POST failed', err);
    return error('サーバーエラーが発生しました', 500);
  }
}
