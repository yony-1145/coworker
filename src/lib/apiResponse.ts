import { NextResponse } from 'next/server';

/**
 * エラーレスポンスと成功レスポンス関数で定義
 * 仕様：
 * - 各エンドポイントで共通のレスポンス形式で返却
 */

// 成功レスポンス
export function success(data: unknown, httpStatus = 200) {
  return NextResponse.json({ status: 'success', data }, { status: httpStatus });
}

// エラーレスポンス
export function error(
  message: string,
  code: number,
  httpStatus?: number,
  errors?: Record<string, string[]>, //　キーと値のセット
) {
  const status = httpStatus ?? code;
  return NextResponse.json(
    {
      status: 'error',
      message,
      ...(errors && Object.keys(errors).length > 0 ? { errors } : {}),
      code,
    },
    { status },
  );
}
