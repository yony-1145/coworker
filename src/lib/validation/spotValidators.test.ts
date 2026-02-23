/** スポット投稿スキーマ（spotPostSchema）の単体テスト */
import { describe, it, expect } from 'vitest';
import { spotPostSchema } from '@/lib/validation/spotValidators';

const validMinimal = {
  title: 'テストカフェ',
  latitude: 35.6812,
  longitude: 139.7671,
};

describe('spotPostSchema', () => {
  describe('success cases', () => {
    it('accepts minimal valid input (title, lat, lng only)', () => {
      const result = spotPostSchema.safeParse(validMinimal);
      expect(result.success).toBe(true);
    });

    it('accepts title with 1-80 characters', () => {
      expect(spotPostSchema.safeParse({ ...validMinimal, title: 'あ' }).success).toBe(true);
      const longTitle = 'あ'.repeat(80);
      expect(spotPostSchema.safeParse({ ...validMinimal, title: longTitle }).success).toBe(true);
    });

    it('trims title', () => {
      const result = spotPostSchema.safeParse({ ...validMinimal, title: '  trim  ' });
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.title).toBe('trim');
    });

    it('accepts latitude in -90 to 90', () => {
      expect(spotPostSchema.safeParse({ ...validMinimal, latitude: -90 }).success).toBe(true);
      expect(spotPostSchema.safeParse({ ...validMinimal, latitude: 90 }).success).toBe(true);
      expect(spotPostSchema.safeParse({ ...validMinimal, latitude: 0 }).success).toBe(true);
    });

    it('accepts longitude in -180 to 180', () => {
      expect(spotPostSchema.safeParse({ ...validMinimal, longitude: -180 }).success).toBe(true);
      expect(spotPostSchema.safeParse({ ...validMinimal, longitude: 180 }).success).toBe(true);
    });

    it('coerces string numbers to number for lat/lng', () => {
      const result = spotPostSchema.safeParse({
        ...validMinimal,
        latitude: '35.68',
        longitude: '139.77',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.latitude).toBe(35.68);
        expect(result.data.longitude).toBe(139.77);
      }
    });

    it('accepts optional description up to 2000 chars', () => {
      const result = spotPostSchema.safeParse({
        ...validMinimal,
        description: '説明'.repeat(500),
      });
      expect(result.success).toBe(true);
    });

    it('accepts optional address up to 255 chars', () => {
      const result = spotPostSchema.safeParse({
        ...validMinimal,
        address: '東京都'.repeat(50),
      });
      expect(result.success).toBe(true);
    });

    it('accepts optional openingHours up to 100 chars', () => {
      const result = spotPostSchema.safeParse({
        ...validMinimal,
        openingHours: '9:00-18:00',
      });
      expect(result.success).toBe(true);
    });

    it('accepts genre CAFE, COWORKING, OTHER', () => {
      expect(spotPostSchema.safeParse({ ...validMinimal, genre: 'CAFE' }).success).toBe(true);
      expect(spotPostSchema.safeParse({ ...validMinimal, genre: 'COWORKING' }).success).toBe(true);
      expect(spotPostSchema.safeParse({ ...validMinimal, genre: 'OTHER' }).success).toBe(true);
    });

    it('accepts optional crowdLevel LOW, MID, HIGH', () => {
      expect(spotPostSchema.safeParse({ ...validMinimal, crowdLevel: 'LOW' }).success).toBe(true);
      expect(spotPostSchema.safeParse({ ...validMinimal, crowdLevel: 'MID' }).success).toBe(true);
      expect(spotPostSchema.safeParse({ ...validMinimal, crowdLevel: 'HIGH' }).success).toBe(true);
    });

    it('accepts optional boolean flags', () => {
      const result = spotPostSchema.safeParse({
        ...validMinimal,
        hasWifi: true,
        hasPower: false,
        hasQuietSpace: true,
      });
      expect(result.success).toBe(true);
    });

    it('accepts valid imageUrls (array of URLs)', () => {
      const result = spotPostSchema.safeParse({
        ...validMinimal,
        imageUrls: ['https://example.com/a.png', 'https://example.com/b.jpg'],
      });
      expect(result.success).toBe(true);
    });

    it('accepts optional tags array', () => {
      const result = spotPostSchema.safeParse({
        ...validMinimal,
        tags: ['WiFi', '静か'],
      });
      expect(result.success).toBe(true);
    });

    it('accepts null/omit for optional fields', () => {
      const result = spotPostSchema.safeParse({
        ...validMinimal,
        description: null,
        address: null,
        imageUrls: null,
        tags: null,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('failure cases', () => {
    it('rejects empty title', () => {
      const result = spotPostSchema.safeParse({ ...validMinimal, title: '' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.title).toBeDefined();
      }
    });

    it('rejects title longer than 80 characters', () => {
      const result = spotPostSchema.safeParse({
        ...validMinimal,
        title: 'あ'.repeat(81),
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.title).toBeDefined();
      }
    });

    it('rejects latitude less than -90', () => {
      const result = spotPostSchema.safeParse({ ...validMinimal, latitude: -90.1 });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.latitude).toBeDefined();
      }
    });

    it('rejects latitude greater than 90', () => {
      const result = spotPostSchema.safeParse({ ...validMinimal, latitude: 90.1 });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.latitude).toBeDefined();
      }
    });

    it('rejects longitude less than -180', () => {
      const result = spotPostSchema.safeParse({ ...validMinimal, longitude: -180.1 });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.longitude).toBeDefined();
      }
    });

    it('rejects longitude greater than 180', () => {
      const result = spotPostSchema.safeParse({ ...validMinimal, longitude: 180.1 });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.longitude).toBeDefined();
      }
    });

    it('rejects description longer than 2000 characters', () => {
      const result = spotPostSchema.safeParse({
        ...validMinimal,
        description: 'a'.repeat(2001),
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.description).toBeDefined();
      }
    });

    it('rejects address longer than 255 characters', () => {
      const result = spotPostSchema.safeParse({
        ...validMinimal,
        address: 'a'.repeat(256),
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.address).toBeDefined();
      }
    });

    it('rejects openingHours longer than 100 characters', () => {
      const result = spotPostSchema.safeParse({
        ...validMinimal,
        openingHours: 'a'.repeat(101),
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.openingHours).toBeDefined();
      }
    });

    it('rejects invalid genre', () => {
      const result = spotPostSchema.safeParse({
        ...validMinimal,
        genre: 'INVALID',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.genre).toBeDefined();
      }
    });

    it('rejects invalid crowdLevel', () => {
      const result = spotPostSchema.safeParse({
        ...validMinimal,
        crowdLevel: 'INVALID',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.crowdLevel).toBeDefined();
      }
    });

    it('rejects invalid URL in imageUrls', () => {
      const result = spotPostSchema.safeParse({
        ...validMinimal,
        imageUrls: ['not-a-url'],
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.imageUrls).toBeDefined();
      }
    });

    it('rejects missing title', () => {
      const result = spotPostSchema.safeParse({
        latitude: validMinimal.latitude,
        longitude: validMinimal.longitude,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.title).toBeDefined();
      }
    });

    it('rejects missing latitude', () => {
      const result = spotPostSchema.safeParse({
        title: validMinimal.title,
        longitude: validMinimal.longitude,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.latitude).toBeDefined();
      }
    });

    it('rejects missing longitude', () => {
      const result = spotPostSchema.safeParse({
        title: validMinimal.title,
        latitude: validMinimal.latitude,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.longitude).toBeDefined();
      }
    });
  });
});
