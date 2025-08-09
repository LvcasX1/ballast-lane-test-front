import { fetcher } from '../../../utils/fetcher';
import type { Book } from '../types/book';

export interface UpdateBookInput {
  id: string;
  changes: Partial<Omit<Book, 'id'>>;
}

export async function useUpdateBook({ id, changes }: UpdateBookInput) {
  const resp = await fetcher.put(`/books/${encodeURIComponent(id)}`, { book: changes }, {
    headers: { 'Content-Type': 'application/json' },
  }).catch((error) => {
    throw new Error(error?.response?.data?.message || error?.message || 'Failed to update book');
  });

  if (resp.status !== 200) throw new Error('Failed to update book');
  return resp.data as Book;
}
