import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { supabaseServer } from '@/lib/supabase/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

function ok(data: unknown, status = 200) {
  return NextResponse.json({ ok: true, ...data }, { status });
}

function err(code: string, message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    { ok: false, error: { code, message, details } },
    { status },
  );
}

function getExtension(filename: string) {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : 'png';
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return err('UNAUTHORIZED', 'Login required', 401);
  }

  const formData = await req.formData();
  const file = formData.get('file');
  const typeRaw = formData.get('type');

  if (!(file instanceof File)) {
    return err('INVALID_FILE', 'File is required', 400);
  }

  const type = typeof typeRaw === 'string' ? typeRaw : 'spot';
  if (type !== 'spot' && type !== 'user') {
    return err('INVALID_TYPE', 'type must be "spot" or "user"', 400);
  }

  if (!file.type.startsWith('image/')) {
    return err('INVALID_MIME', 'Image only', 400);
  }

  if (file.size > 5 * 1024 * 1024) {
    return err('FILE_TOO_LARGE', 'Max 5MB', 400);
  }

  const bucket = type === 'user' ? 'user-icons' : 'spot-images';
  const dir = type === 'user' ? 'users' : 'spots';
  const ext = getExtension(file.name);
  const filePath = `${dir}/${session.user.id}_${Date.now()}.${ext}`;

  const { error } = await supabaseServer.storage
    .from(bucket)
    .upload(filePath, file, { upsert: true, contentType: file.type });

  if (error) {
    console.error(error);
    return err('UPLOAD_FAILED', 'Upload failed', 500);
  }

  const { data } = supabaseServer.storage.from(bucket).getPublicUrl(filePath);

  return ok({ url: data.publicUrl }, 201);
}
