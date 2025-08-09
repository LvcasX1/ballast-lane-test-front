import { fetcher } from '../../../utils/fetcher';

// POST /borrowings/:id/return
export async function useReturnBorrowing(borrowingId: string | number) {
  const resp = await fetcher.post(`/borrowings/${encodeURIComponent(String(borrowingId))}/return`, {}, {
    headers: { 'Content-Type': 'application/json' },
  }).catch((error) => {
    throw new Error(error?.response?.data?.message || error?.message || 'Failed to mark as returned');
  });

  if (resp.status !== 200 && resp.status !== 201) throw new Error('Failed to mark as returned');
  return resp.status;
}
