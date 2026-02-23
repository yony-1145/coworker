import { z } from 'zod';

/** スポット投稿（POST）用の入力スキーマ。API 側の型・必須項目・制約を保証する。 */
export const spotPostSchema = z.object({
  title: z.string().trim().min(1).max(80),
  description: z.string().trim().max(2000).optional().nullable(),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  address: z.string().trim().max(255).optional().nullable(),
  openingHours: z.string().trim().max(100).optional().nullable(),
  genre: z.enum(['CAFE', 'COWORKING', 'OTHER']).optional(),
  hasWifi: z.boolean().optional(),
  hasPower: z.boolean().optional(),
  hasQuietSpace: z.boolean().optional(),
  hasLargeTable: z.boolean().optional(),
  hasPhoneCallOK: z.boolean().optional(),
  hasMeetingSpace: z.boolean().optional(),
  crowdLevel: z.enum(['LOW', 'MID', 'HIGH']).optional(),
  imageUrls: z.array(z.string().url()).optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
});

/** スポット投稿の入力型 */
export type SpotPost = z.infer<typeof spotPostSchema>;
