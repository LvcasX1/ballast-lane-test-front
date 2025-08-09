import { fetcher } from '../../../utils/fetcher';
import type { LibrarianDashboard } from '../types/dashboard';

export async function useGetLibrarianDashboard(): Promise<LibrarianDashboard> {
  const resp = await fetcher.get('/dashboards/librarian', {
    headers: { 'Content-Type': 'application/json' },
  }).catch((error) => {
    throw new Error(error?.response?.data?.message || error?.message || 'Failed to fetch dashboard');
  });

  if (resp.status !== 200) throw new Error('Failed to fetch dashboard');
  return resp.data as LibrarianDashboard;
}

// New: current borrowings that are not overdue
export async function useGetCurrentBorrowings(): Promise<any[]> {
  const resp = await fetcher.get('/borrowings/current', {
    headers: { 'Content-Type': 'application/json' },
  }).catch((error) => {
    throw new Error(error?.response?.data?.message || error?.message || 'Failed to fetch current borrowings');
  });
  if (resp.status !== 200) throw new Error('Failed to fetch current borrowings');
  return resp.data as any[];
}
