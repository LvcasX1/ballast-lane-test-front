export interface UserInterface {
  id: string;
  name: string;
  email_address: string;
  role: 'librarian' | 'member';
}