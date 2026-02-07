import { getServerSession } from 'next-auth';
import { supabaseServer } from '@/lib/supabase/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { error, success } from '@/lib/apiResponse';

function getExtension(filename: string) {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : 'png';
}

/**
 * 画像アップロード API
 *
 * 仕様：
 * - ログイン必須
 * - type: "spot" | "user" でバケットを切り替え
 * - 画像のみ・最大5MB
 */
export async function POST(req: Request) {
  // ログインユーザのみ許可
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return error('ログインしてください', 401);
  }

  // リクエストからファイル・種別を取得
  const formData = await req.formData();
  const file = formData.get('file');
  const typeRaw = formData.get('type');

  // ファイル必須
  if (!(file instanceof File)) {
    return error('ファイルを選択してください', 400);
  }

  // type: "spot" | "user" のみ許可
  const type = typeof typeRaw === 'string' ? typeRaw : 'spot';
  if (type !== 'spot' && type !== 'user') {
    return error('type は "spot" または "user" を指定してください', 400);
  }

  // 画像のみ許可
  if (!file.type.startsWith('image/')) {
    return error('画像ファイルのみアップロードできます', 400);
  }

  // サイズ上限 5MB
  if (file.size > 5 * 1024 * 1024) {
    return error('ファイルサイズは5MB以内にしてください', 400);
  }

  // 保存先バケット・ディレクトリを type で決定（重複回避のため userId_タイムスタンプ.拡張子）
  const bucket = type === 'user' ? 'user-icons' : 'spot-images';
  const dir = type === 'user' ? 'users' : 'spots';
  const ext = getExtension(file.name);
  const filePath = `${dir}/${session.user.id}_${Date.now()}.${ext}`;

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
}
