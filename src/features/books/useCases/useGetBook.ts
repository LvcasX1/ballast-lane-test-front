import { fetcher } from '../../../utils/fetcher';
import type { Book } from '../types/book';

export async function useGetBook(id: string): Promise<Book> {
  const resp = await fetcher.get(`/books/${encodeURIComponent(id)}`, {
    headers: { 'Content-Type': 'application/json' },
  }).catch((error) => {
    throw new Error(error?.message || 'Failed to fetch book');
  });

  if (resp.status !== 200) throw new Error('Failed to fetch book');
  return resp.data as Book;
}
