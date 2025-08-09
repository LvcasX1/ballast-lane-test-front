import { fetcher } from "../../../utils/fetcher";

export const useLogout = async () => {
  const resp = await logoutRequest();

  if (resp.status !== 200 && resp.status !== 204) {
    throw new Error('Logout failed');
  }

  return resp.status;
}

async function logoutRequest() {
  const response = await fetcher.delete('/session', {
    headers: {
      'Content-Type': 'application/json',
    }
  }).catch(error => {
    throw new Error(error?.response?.data?.message || error.message || 'Logout failed');
  });

  return response;
}
