import { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { profileValidators } from '@/lib/validation/profileValidators';

/**
 * プロフィール編集フォーム用のカスタムフック
 * - 状態管理
 * - バリデーション
 * - 送信処理
 * - 画像アップロード処理
 */
export const useProfileForm = (initialProfile: any, id: string) => {
  const [profile, setProfile] = useState(initialProfile);
  const [errors, setErrors] = useState<Record<string, string | string[]>>({});
  const [preview, setPreview] = useState<string | null>(
    initialProfile.iconUrl || null
  );
  const router = useRouter();

  /** 全項目の一括バリデーション */
  const validateAll = (p: any) => {
    const newErrors: Record<string, string | string[]> = {};
    for (const [key, rule] of Object.entries(profileValidators)) {
      const value = key === 'links' ? (p.links ?? []) : ((p as any)[key] ?? '');
      const err = rule(value);
      if (err && (Array.isArray(err) ? err.some(Boolean) : err)) {
        newErrors[key] = err;
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /** 単項目の変更＋即時バリデーション */
  const handleChange = (name: string, value: string) => {
    setProfile((prev: any) => ({ ...prev, [name]: value }));
    const rule = profileValidators[name as keyof typeof profileValidators];
    if (rule) {
      const err = rule(value);
      setErrors((prev) => ({ ...prev, [name]: err }));
    }
  };

  /** SNSリンク配列の更新＋バリデーション */
  const handleLinkChange = (links: string[]) => {
    setProfile((prev: any) => ({ ...prev, links }));
    const linkErrors = profileValidators.links(links);
    setErrors((prev) => ({ ...prev, links: linkErrors }));
  };

  /** タグ配列の更新＋バリデーション */
  const handleTagChange = (tags: string[]) => {
    setProfile((prev: any) => ({ ...prev, tags }));
    const tagError = profileValidators.tags(tags);
    setErrors((prev) => ({ ...prev, tags: tagError }));
  };

  /** 保存処理 */
  const handleSubmit = async () => {
    if (!validateAll(profile)) {
      alert('入力内容に誤りがあります。修正してください。');
      return;
    }

    const payload = {
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

      if (!res.ok) throw new Error(`更新に失敗しました (${res.status})`);
      alert('プロフィールを保存しました');
      router.push(`/users/${id}`);
    } catch (err) {
      console.error('Update failed:', err);
      alert('エラーが発生しました。もう一度お試しください。');
    }
  };

  /** 画像アップロード（Supabase Storage） */
  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    try {
      const filePath = `${profile.id}_${Date.now()}`;
      const { error: uploadError } = await supabase.storage
        .from('user-icons')
        .upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('user-icons')
        .getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      setPreview(publicUrl);
      setProfile({ ...profile, iconUrl: publicUrl });
      alert('画像をアップロードしました。保存ボタンを押して確定してください。');
    } catch (err) {
      console.error('Upload failed:', err);
      alert('画像のアップロードに失敗しました。');
    }
  };

  return {
    profile,
    errors,
    preview,
    handleChange,
    handleLinkChange,
    handleTagChange,
    handleImageChange,
    handleSubmit,
  };
};
