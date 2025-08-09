import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './components/Home';
import AppLayout from './components/AppLayout';

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
]);
