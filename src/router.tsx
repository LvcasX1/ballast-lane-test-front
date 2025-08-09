import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';
import Home from './components/Home';
import AppLayout from './components/AppLayout';
import Login from './features/login/pages/Login';
import SignUp from './features/login/pages/SignUp';
import { isLoggedIn } from './utils/auth';

// Guests-only guard: redirects authenticated users to home
function GuestOnly({ children }: { children: React.ReactElement }) {
  return isLoggedIn() ? <Navigate to="/" replace /> : children;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AppLayout>
        <Home />
      </AppLayout>
    ),
  },
  {
    path: "/app",
    element: (
      <AppLayout>
        <App />
      </AppLayout>
    ),
  },
  {
    path: "/login",
    element: (
      <AppLayout>
        <GuestOnly>
          <Login />
        </GuestOnly>
      </AppLayout>
    ),
  },
  {
    path: "/sign-up",
    element: (
      <AppLayout>
        <GuestOnly>
          <SignUp />
        </GuestOnly>
      </AppLayout>
    ),
  },
]);
