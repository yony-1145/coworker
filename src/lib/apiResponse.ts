import { NextResponse } from 'next/server';

/** 各エンドポイントで共通のレスポンス形式を返す。 */

/** 成功レスポンス（status: 'success', data） */
export function success(data: unknown, httpStatus = 200) {
  return NextResponse.json({ status: 'success', data }, { status: httpStatus });
}

/** エラーレスポンス（status: 'error', message, code, 任意で errors） */
export function error(
  message: string,
  code: number,
  httpStatus?: number,
  errors?: Record<string, string[]>,
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
