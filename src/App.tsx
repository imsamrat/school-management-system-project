import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { store } from '@/store';
import { router } from '@/routes';
import { AuthProvider } from '@/features/auth/AuthProvider';

export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </Provider>
  );
}
