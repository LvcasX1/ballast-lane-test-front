import { fetcher } from "../../../utils/fetcher";

export const useLogout = async () => {
  const resp = await logoutRequest();

  if (resp.status !== 200 && resp.status !== 204) {
    throw new Error('Logout failed');
  }

  return resp.status;
}

async function logoutRequest() {
  const raw = sessionStorage.getItem('app.auth.token');
  const token = raw ? JSON.parse(raw) : '';

  const response = await fetcher.delete('/session', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    }
  }).catch(error => {
    throw new Error(error?.response?.data?.message || error.message || 'Logout failed');
  });

  return response;
}
