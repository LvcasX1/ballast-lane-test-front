import { login } from "../../../utils/auth";
import { fetcher } from "../../../utils/fetcher";

export const useLogin = async (email: string, password: string) => {
  const resp = await loginRequest({
    email,
    password,
  });

  if (resp.status !== 200) {
    throw new Error('Login failed');
  }

  if ("auth_token" in resp.data) {
    const auth_token = resp.data.auth_token as string;
    const role = (resp.data?.user?.role || resp.data?.role) as 'librarian' | 'member' | undefined;
    console.log('Login successful, token:', auth_token, 'role:', role);
    login(auth_token, role);
  }

  return resp.status;
}


interface loginProps {
  email: string;
  password: string;
}

async function loginRequest({email, password}: loginProps) {
  const response = await fetcher.post('/session', {
    email_address: email,
    password,
  }, {
    headers: {
      'Content-Type': 'application/json',
    }
  }).catch(error => {
    throw new Error(error.message || 'Login failed');
  });

  return response
}