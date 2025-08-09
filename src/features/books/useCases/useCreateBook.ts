import { fetcher } from '../../../utils/fetcher';
import type { Book } from '../types/book';

export type CreateBookInput = Omit<Book, 'id'>;

export async function useCreateBook(input: CreateBookInput) {
  const resp = await fetcher.post('/books', { book: input }, {
    headers: { 'Content-Type': 'application/json' },
  }).catch((error) => {
    throw new Error(error?.response?.data?.message || error?.message || 'Failed to create book');
  });

  if (resp.status !== 201 && resp.status !== 200) throw new Error('Failed to create book');
  return resp.data as Book;
}
