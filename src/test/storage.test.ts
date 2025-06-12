import { testStorageUpload } from '@/lib/firebase';

describe('Firebase Storage', () => {
  test('should upload test image', async () => {
    const result = await testStorageUpload();
    expect(result.success).toBe(true);
    expect(result.url).toBeDefined();
  }, 10000); // Setting timeout to 10s for upload
});