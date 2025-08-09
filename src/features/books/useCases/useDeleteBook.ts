import { fetcher } from '../../../utils/fetcher';

export async function useDeleteBook(id: string) {
  const resp = await fetcher.delete(`/books/${encodeURIComponent(id)}`, {
    headers: { 'Content-Type': 'application/json' },
  }).catch((error) => {
    throw new Error(error?.response?.data?.message || error?.message || 'Failed to delete book');
  });

  if (resp.status !== 200 && resp.status !== 204) throw new Error('Failed to delete book');
  return resp.status;
}
