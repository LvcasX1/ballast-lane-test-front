import { fetcher } from '../../../utils/fetcher';

export async function useBorrowBook(id: string) {
  const resp = await fetcher.post(`/borrowings`, {
    "book_id": id
  }, {
    headers: { 'Content-Type': 'application/json' },
  }).catch((error) => {
    throw new Error(error?.response?.data?.message || error?.message || 'Failed to borrow book');
  });

  if (resp.status !== 200 && resp.status !== 201) throw new Error('Failed to borrow book');
  return resp.status;
}
