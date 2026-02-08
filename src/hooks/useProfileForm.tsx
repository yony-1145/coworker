import { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { userProfileSchema } from '@/lib/validation/userProfileValidators';

export type UserProfileForm = {
  iconUrl?: string | null;
  headline?: string | null;
  occupation?: string | null;
  affiliation?: string | null;
  bioText?: string | null;
  links?: string[];
  tags?: string[];
};

/**
 * プロフィール編集フォーム用のカスタムフック
 *
 * - serProfileSchemaでバリデーション
 *
 */
export const useProfileForm = (
  initialProfile: UserProfileForm | null,
  initialUserName: string,
  id: string,
) => {
  const [notice, setNotice] = useState<{
    type: 'error' | 'success' | 'info';
    message: string;
  } | null>(null);
  const [name, setName] = useState(initialUserName ?? '');
  const [profile, setProfile] = useState<UserProfileForm>(
    initialProfile ?? { links: [], tags: [] },
  );
  const [errors, setErrors] = useState<Record<string, string | string[]>>({});
  const [preview, setPreview] = useState<string | null>(
    initialProfile?.iconUrl || null,
  );
  const router = useRouter();

  // name + profile を userProfileSchema で検証し、エラーをフォーム用の形で返す
  const getValidationErrors = (
    p: UserProfileForm,
    userName: string,
  ): Record<string, string | string[]> => {
    const payload = {
      name: userName ?? '',
      iconUrl: p?.iconUrl ?? null,
      headline: p?.headline ?? null,
      occupation: p?.occupation ?? null,
      affiliation: p?.affiliation ?? null,
      bioText: p?.bioText ?? null,
      links: p?.links ?? [],
      tags: p?.tags ?? [],
    };
    const result = userProfileSchema.safeParse(payload);
    if (result.success) return {};
    const fieldErrors = result.error.flatten().fieldErrors;
    const newErrors: Record<string, string | string[]> = {};
    for (const [k, v] of Object.entries(fieldErrors)) {
      if (!v?.length) continue;
      newErrors[k] = k === 'links' ? v : v[0];
    }
    return newErrors;
  };

  const validateAll = (p: UserProfileForm, userName: string) => {
    const newErrors = getValidationErrors(p, userName);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * 表示名（User.name）の変更＋即時バリデーション
   */
  const handleNameChange = (value: string) => {
    setName(value);
    setErrors(getValidationErrors(profile, value));
  };

  //単項目の変更＋即時バリデーション
  const handleChange = (field: string, value: string) => {
    const nextProfile = { ...profile, [field]: value };
    setProfile(nextProfile);
    setErrors(getValidationErrors(nextProfile, name));
  };

  // SNSリンク配列の更新＋バリデーション
  const handleLinkChange = (links: string[]) => {
    const nextProfile = { ...profile, links };
    setProfile(nextProfile);
    setErrors(getValidationErrors(nextProfile, name));
  };

  // タグ配列の更新＋バリデーション
  const handleTagChange = (tags: string[]) => {
    const nextProfile = { ...profile, tags };
    setProfile(nextProfile);
    setErrors(getValidationErrors(nextProfile, name));
  };

  /**
   * 保存処理
   * - 全項目をバリデーションしてから API に PUT する
   */
  const handleSubmit = async () => {
    setNotice(null);
    if (!validateAll(profile, name)) {
      setNotice({
        type: 'error',
        message: '入力内容に誤りがあります。修正してください。',
      });
      return;
    }

    const payload = {
      name,
      ...profile,
      links: profile.links ?? [],
      tags: profile.tags ?? [],
    };

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const body = await res.json().catch(() => null);

      if (!res.ok || body?.status === 'error') {
        const msg = body?.message ?? `更新に失敗しました (${res.status})`;
        throw new Error(msg);
      }

      setNotice({ type: 'success', message: 'プロフィールを保存しました。' });
      router.push(`/users/${id}`);
    } catch (err) {
      console.error('Update failed:', err);
      setNotice({
        type: 'error',
        message: 'エラーが発生しました。もう一度お試しください。',
      });
    }
  };

  /**
   * 画像アップロード（/api/uploads 経由）
   * - クライアントから Storage に直接 upload せず、サーバAPIに File を送信する
   * - ログイン必須チェックはサーバ側（NextAuth）で行われる
   */
  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    setNotice(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'user');

      const uploadRes = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      });

      const uploadBody = await uploadRes.json().catch(() => null);

      if (!uploadRes.ok || uploadBody?.status === 'error') {
        const msg = uploadBody?.message ?? '画像のアップロードに失敗しました。';
        setNotice({ type: 'error', message: msg });
        return;
      }

      const publicUrl: string = uploadBody?.data?.url ?? '';

      setPreview(publicUrl);
      setProfile({ ...profile, iconUrl: publicUrl });
      setNotice({
        type: 'info',
        message:
          '画像をアップロードしました。保存ボタンを押して確定してください。',
      });
    } catch (err) {
      console.error('Upload failed:', err);
      setNotice({ type: 'error', message: '画像のアップロードに失敗しました。' });
    }
  };

  return {
    name,
    profile,
    errors,
    preview,
    notice,
    handleNameChange,
    handleChange,
    handleLinkChange,
    handleTagChange,
    handleImageChange,
    handleSubmit,
  };
};
