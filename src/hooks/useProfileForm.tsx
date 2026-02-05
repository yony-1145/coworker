import { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { profileValidators } from '@/lib/validation/profileValidators';

/**
 * プロフィール編集フォーム用のカスタムフック
 * - 状態管理
 * - バリデーション
 * - 送信処理
 * - 画像アップロード処理（/api/uploads 経由）
 */
export const useProfileForm = (
  initialProfile: any,
  initialUserName: string,
  id: string,
) => {
  const [name, setName] = useState(initialUserName ?? '');
  const [profile, setProfile] = useState(initialProfile);
  const [errors, setErrors] = useState<Record<string, string | string[]>>({});
  const [preview, setPreview] = useState<string | null>(
    initialProfile?.iconUrl || null,
  );
  const router = useRouter();

  // ToDo:バリデーションの修正予定
  const validateAll = (p: any, userName: string) => {
    const newErrors: Record<string, string | string[]> = {};

    for (const [key, rule] of Object.entries(profileValidators)) {
      if (key === 'displayName') continue;
      const value = key === 'links' ? (p.links ?? []) : ((p as any)[key] ?? '');
      const err = rule(value);
      if (err && (Array.isArray(err) ? err.some(Boolean) : err)) {
        newErrors[key] = err;
      }
    }

    const nameRule = profileValidators.displayName;
    if (nameRule) {
      const err = nameRule(userName ?? '');
      if (err && (Array.isArray(err) ? err.some(Boolean) : err)) {
        newErrors.name = err as any;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * 表示名（User.name）の変更＋即時バリデーション
   * - profileValidators.displayName を流用
   */
  const handleNameChange = (value: string) => {
    setName(value);
    const rule = profileValidators.displayName;
    if (rule) {
      const err = rule(value);
      setErrors((prev) => ({ ...prev, name: err }));
    }
  };

  /**
   * 単項目の変更＋即時バリデーション
   * - 入力値を更新し、対象項目だけ validators を適用して errors を更新する
   */
  const handleChange = (field: string, value: string) => {
    setProfile((prev: any) => ({ ...prev, [field]: value }));
    const rule = profileValidators[field as keyof typeof profileValidators];
    if (rule) {
      const err = rule(value);
      setErrors((prev) => ({ ...prev, [field]: err }));
    }
  };

  /**
   * SNSリンク配列の更新＋バリデーション
   * - links の配列を更新し、配列用の validators を適用する
   */
  const handleLinkChange = (links: string[]) => {
    setProfile((prev: any) => ({ ...prev, links }));
    const linkErrors = profileValidators.links(links);
    setErrors((prev) => ({ ...prev, links: linkErrors }));
  };

  /**
   * タグ配列の更新＋バリデーション
   * - tags の配列を更新し、配列用の validators を適用する
   */
  const handleTagChange = (tags: string[]) => {
    setProfile((prev: any) => ({ ...prev, tags }));
    const tagError = profileValidators.tags(tags);
    setErrors((prev) => ({ ...prev, tags: tagError }));
  };

  /**
   * 保存処理
   * - 全項目をバリデーションしてから API に PUT する
   */
  const handleSubmit = async () => {
    if (!validateAll(profile, name)) {
      alert('入力内容に誤りがあります。修正してください。');
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

      alert('プロフィールを保存しました');
      router.push(`/users/${id}`);
    } catch (err) {
      console.error('Update failed:', err);
      alert('エラーが発生しました。もう一度お試しください。');
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
        alert(msg);
        return;
      }

      const publicUrl: string = uploadBody?.data?.url ?? '';

      setPreview(publicUrl);
      setProfile({ ...profile, iconUrl: publicUrl });
      alert('画像をアップロードしました。保存ボタンを押して確定してください。');
    } catch (err) {
      console.error('Upload failed:', err);
      alert('画像のアップロードに失敗しました。');
    }
  };

  return {
    name,
    profile,
    errors,
    preview,
    handleNameChange,
    handleChange,
    handleLinkChange,
    handleTagChange,
    handleImageChange,
    handleSubmit,
  };
};
