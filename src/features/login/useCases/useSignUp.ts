import { fetcher } from "../../../utils/fetcher";

export interface SignUpPayload {
  name: string;
  email_address: string;
  password: string;
  password_confirmation: string;
}

export const useSignUp = async (payload: SignUpPayload) => {
  const resp = await signUpRequest(payload);
  return resp.status;
}

async function signUpRequest(payload: SignUpPayload) {
  return await fetcher.post('/sign-up', {
    user: {
      name: payload.name,
      email_address: payload.email_address,
      password: payload.password,
      password_confirmation: payload.password_confirmation,
    },
  }).then(response => {
    if (response.status !== 200 && response.status !== 201) {
      throw new Error('Sign up failed');
    }
    return response;
  }).catch(error => {
    throw new Error(error?.response?.data?.message || error.message || 'Sign up failed');
  });
}
