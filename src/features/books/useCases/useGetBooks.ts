import { fetcher } from '../../../utils/fetcher';
import type { Book } from '../types/book';

export async function useGetBooks(): Promise<Book[]> {
  const resp = await fetcher.get('/books', {
    headers: { 'Content-Type': 'application/json' },
  }).catch((error) => {
    throw new Error(error?.message || 'Failed to fetch books');
  });

  if (resp.status !== 200) throw new Error('Failed to fetch books');
  return resp.data as Book[];
}
